import express from 'express';
import { supabase } from '../supabase.js';
import nodemailer from 'nodemailer';

const router = express.Router();

const URGENT_KEYWORDS = ['chute', 'malaise', 'saignement', 'respirer', 'thoracique',
  'connaissance', 'confusion', 'urgence', 'inquiétante', 'douleur', 'perte'];

function detectPriority(text = '') {
  const lower = text.toLowerCase();
  if (URGENT_KEYWORDS.some(k => lower.includes(k))) return 'urgente';
  if (lower.includes('rappeler') || lower.includes('modifier') || lower.includes('nouveau patient')) return 'haute';
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
          ${appel.priorite === 'urgente' ? '<p style="color:red;font-weight:bold">⚠️ Cet appel a été marqué comme potentiellement urgent. Consultez le détail immédiatement.</p>' : ''}
          <hr/>
          <p style="font-size:12px;color:#666">Cet assistant ne remplace pas votre jugement clinique. En cas d'urgence vitale, le patient doit appeler le 112.</p>
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
    // Support both Vapi webhook format and direct POST
    const callData = body.message?.call || body.call || body;
    const analysis = body.message?.analysis || body.analysis || {};

    const infirmiere_id = callData.assistantId || body.nurse_id || body.infirmiere_id;
    const vapi_call_id = callData.id || body.call_id;

    if (!infirmiere_id) return res.status(400).json({ error: 'infirmiere_id manquant' });

    // Get infirmière info
    const { data: infirmiere } = await supabase
      .from('infirmieres')
      .select('id,nom,prenom,email,email_notifications')
      .eq('vapi_agent_id', infirmiere_id)
      .single();

    const nom_appelant = analysis.patient_name || body.nom_appelant || 'Inconnu';
    const motif = analysis.reason || body.motif || 'Non précisé';
    const resume = analysis.summary || body.resume || '';
    const priorite = body.priorite || detectPriority(motif + ' ' + resume);
    const categorie = body.categorie || analysis.category || 'autre';

    const appelData = {
      infirmiere_id: infirmiere?.id || infirmiere_id,
      infirmiere_nom: infirmiere ? `${infirmiere.prenom} ${infirmiere.nom}` : '',
      nom_appelant,
      telephone_appelant: callData.customer?.number || body.telephone_appelant || '',
      commune: body.commune || analysis.city || '',
      motif,
      resume,
      priorite,
      categorie,
      statut: 'nouveau',
      situation_urgente_declaree: priorite === 'urgente',
      vapi_call_id,
      audio_url: callData.recordingUrl || body.audio_url || null,
      duree_appel_secondes: callData.duration || body.duree_appel_secondes || null,
      date_appel: callData.startedAt || body.date_appel || new Date().toISOString()
    };

    const { data: savedAppel, error } = await supabase
      .from('appels')
      .upsert([appelData], { onConflict: 'vapi_call_id' })
      .select()
      .single();

    if (error) throw error;

    // Send notification
    if (infirmiere) await sendNotificationEmail(infirmiere, savedAppel);

    res.status(200).json({ success: true, appel_id: savedAppel.id });
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/webhook/calls — endpoint générique (Twilio, etc.)
router.post('/calls', async (req, res) => {
  try {
    const body = req.body;
    const infirmiere_id = body.nurse_id || body.infirmiere_id;
    if (!infirmiere_id) return res.status(400).json({ error: 'nurse_id manquant' });

    const { data: infirmiere } = await supabase
      .from('infirmieres')
      .select('id,nom,prenom,email,email_notifications')
      .eq('id', infirmiere_id)
      .single();

    if (!infirmiere) return res.status(404).json({ error: 'Infirmière non trouvée' });

    const motif = body.reason || body.motif || '';
    const resume = body.summary || body.resume || '';
    const priorite = body.priority || body.priorite || detectPriority(motif + ' ' + resume);

    const appelData = {
      infirmiere_id: infirmiere.id,
      infirmiere_nom: `${infirmiere.prenom} ${infirmiere.nom}`,
      nom_appelant: body.patient_name || body.nom_appelant || 'Inconnu',
      telephone_appelant: body.caller_phone || body.patient_phone || '',
      commune: body.city || body.commune || '',
      motif,
      resume,
      priorite,
      categorie: body.category || body.categorie || 'autre',
      statut: 'nouveau',
      situation_urgente_declaree: priorite === 'urgente',
      vapi_call_id: body.call_id || null,
      audio_url: body.audio_url || null,
      duree_appel_secondes: body.duration || null,
      date_appel: body.created_at || new Date().toISOString()
    };

    const { data: savedAppel, error } = await supabase
      .from('appels')
      .insert([appelData])
      .select()
      .single();

    if (error) throw error;
    if (infirmiere) await sendNotificationEmail(infirmiere, savedAppel);

    res.status(201).json({ success: true, appel_id: savedAppel.id });
  } catch (err) {
    console.error('Webhook calls error:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
