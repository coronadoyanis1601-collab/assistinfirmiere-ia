import express from 'express';
import { supabase } from '../supabase.js';
import nodemailer from 'nodemailer';

const router = express.Router();

const URGENT_KEYWORDS = ['chute', 'malaise', 'saignement', 'respirer', 'thoracique',
  'connaissance', 'confusion', 'urgence', 'inquiétante', 'douleur', 'perte'];

function detectPriority(text = '') {
  const lower = text.toLowerCase();
  if (URGENT_KEYWORDS.some(k => lower.includes(k))) return 'urgente';
  if (lower.includes('rappeler') || lower.includes('nouveau patient')) return 'haute';
  return 'moyenne';
}

async function sendNotificationEmail(infirmiere, appel) {
  if (!process.env.SMTP_HOST || !infirmiere?.email_notifications) return;
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    });
    const prioriteLabel = { urgente: '🔴 URGENTE', haute: '🟠 Haute', moyenne: '🟡 Moyenne', basse: '⚪ Basse' }[appel.priorite] || appel.priorite;
    await transporter.sendMail({
      from: `"Assist'Infirmière IA" <${process.env.SMTP_USER}>`,
      to: infirmiere.email,
      subject: `📞 Nouvel appel — Priorité ${appel.priorite}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;padding:20px">
          <h2 style="color:#0e7490">📞 Nouvel appel reçu</h2>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px;font-weight:bold">Patient :</td><td>${appel.nom_appelant || 'Non renseigné'}</td></tr>
            <tr style="background:#f0f9ff"><td style="padding:8px;font-weight:bold">Téléphone :</td><td>${appel.telephone_appelant || '-'}</td></tr>
            <tr><td style="padding:8px;font-weight:bold">Commune :</td><td>${appel.commune || '-'}</td></tr>
            <tr style="background:#f0f9ff"><td style="padding:8px;font-weight:bold">Motif :</td><td>${appel.motif || '-'}</td></tr>
            <tr><td style="padding:8px;font-weight:bold">Priorité :</td><td><strong>${prioriteLabel}</strong></td></tr>
            <tr style="background:#f0f9ff"><td style="padding:8px;font-weight:bold">Résumé :</td><td>${appel.resume || '-'}</td></tr>
          </table>
          ${appel.priorite === 'urgente' ? '<p style="color:red;font-weight:bold">⚠️ Appel potentiellement urgent. Consultez immédiatement.</p>' : ''}
          <hr/>
          <p style="font-size:12px;color:#666">Cet assistant ne remplace pas votre jugement clinique. En cas d&apos;urgence vitale, le patient doit appeler le 112.</p>
        </div>
      `
    });
  } catch (e) {
    console.warn('Email notification failed:', e.message);
  }
}

// POST /api/webhook/vapi — reçoit les données d'appel terminé depuis Vapi
router.post('/vapi', async (req, res) => {
  try {
    const body = req.body;
    const msg = body.message || body;

    // Only process end-of-call reports
    if (msg.type && msg.type !== 'end-of-call-report') {
      return res.json({ status: 'ignored', type: msg.type });
    }

    const call = msg.call || body.call || {};
    // Vapi structuredData lives in analysis.structuredData
    const structured = msg.analysis?.structuredData || body.analysis?.structuredData || {};
    const summary = msg.summary || body.summary || structured.resume || '';

    const assistantId = call.assistantId || body.assistantId;
    if (!assistantId) return res.status(400).json({ error: 'assistantId manquant' });

    // Find infirmière by vapi_agent_id
    const { data: infirmiere } = await supabase
      .from('infirmieres')
      .select('id,nom,prenom,email,email_notifications')
      .eq('vapi_agent_id', assistantId)
      .single();

    const motif = structured.motif || body.motif || 'Non précisé';
    const resume = summary;
    const priorite = structured.priorite || body.priorite || detectPriority(motif + ' ' + resume);

    const appelData = {
      infirmiere_id: infirmiere?.id || null,
      infirmiere_nom: infirmiere ? `${infirmiere.prenom} ${infirmiere.nom}` : '',
      nom_appelant: structured.nom_appelant || body.nom_appelant || 'Inconnu',
      telephone_appelant: structured.telephone_rappel || call.customer?.number || body.telephone_appelant || '',
      commune: structured.commune || body.commune || '',
      motif,
      resume,
      priorite,
      categorie: structured.categorie || body.categorie || 'autre',
      statut: 'nouveau',
      situation_urgente_declaree: structured.situation_urgente === true || priorite === 'urgente',
      vapi_call_id: call.id || body.call_id || null,
      audio_url: msg.recordingUrl || call.recordingUrl || null,
      duree_appel_secondes: call.duration || (call.endedAt && call.startedAt
        ? Math.round((new Date(call.endedAt) - new Date(call.startedAt)) / 1000)
        : null),
      date_appel: call.startedAt || new Date().toISOString()
    };

    if (!appelData.infirmiere_id) {
      return res.status(404).json({ error: `Aucune infirmière trouvée pour l'agent Vapi ${assistantId}` });
    }

    const { data: savedAppel, error } = await supabase
      .from('appels')
      .upsert([appelData], { onConflict: 'vapi_call_id' })
      .select()
      .single();

    if (error) throw error;

    if (infirmiere) await sendNotificationEmail(infirmiere, savedAppel);

    console.log(`[Webhook] Appel enregistré: ${savedAppel.id} pour ${appelData.nom_appelant}`);
    res.status(200).json({ success: true, appel_id: savedAppel.id });
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
