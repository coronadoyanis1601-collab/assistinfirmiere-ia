import express from 'express';
import { supabase } from '../supabase.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// GET /api/infirmieres/:id/config — config de l'assistant
router.get('/config', authMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('infirmieres')
      .select('id,nom,prenom,email,telephone,commune,vapi_agent_id,numero_telephone_vapi,statut_agent,plan,email_notifications,sms_notifications,message_accueil_custom,heures_disponibilite')
      .eq('id', req.user.id)
      .single();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/infirmieres/config — mise à jour config
router.put('/config', authMiddleware, async (req, res) => {
  try {
    const allowed = ['nom', 'prenom', 'telephone', 'commune', 'email_notifications',
      'sms_notifications', 'message_accueil_custom', 'heures_disponibilite',
      'vapi_agent_id', 'numero_telephone_vapi', 'statut_agent'];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }
    const { data, error } = await supabase
      .from('infirmieres')
      .update(updates)
      .eq('id', req.user.id)
      .select()
      .single();
    if (error) throw error;
    const { password_hash, ...safeData } = data;
    res.json(safeData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
