import express from 'express';
import bcrypt from 'bcryptjs';
import { supabase } from '../supabase.js';
import { generateToken, authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { nom, prenom, email, telephone, password, commune } = req.body;
    if (!email || !password || !nom || !prenom) {
      return res.status(400).json({ error: 'Champs obligatoires manquants' });
    }

    // Check existing
    const { data: existing } = await supabase
      .from('infirmieres')
      .select('id')
      .eq('email', email)
      .single();

    if (existing) return res.status(409).json({ error: 'Email déjà utilisé' });

    const password_hash = await bcrypt.hash(password, 12);
    const message_accueil_custom = `Bonjour, vous êtes bien sur l'assistant téléphonique de ${prenom} ${nom}, infirmière indépendante. Je vais prendre votre message afin qu'elle puisse vous recontacter. En cas d'urgence vitale, veuillez appeler immédiatement le 112.`;

    const { data, error } = await supabase
      .from('infirmieres')
      .insert([{
        nom, prenom, email, telephone,
        commune, password_hash, message_accueil_custom,
        statut_agent: 'demo', plan: 'demo',
        email_notifications: true
      }])
      .select()
      .single();

    if (error) throw error;

    const token = generateToken({ id: data.id, email: data.email, nom: data.nom, prenom: data.prenom });
    const { password_hash: _, ...safeData } = data;
    res.status(201).json({ token, user: safeData });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email et mot de passe requis' });

    const { data, error } = await supabase
      .from('infirmieres')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !data) return res.status(401).json({ error: 'Email ou mot de passe incorrect' });

    const valid = await bcrypt.compare(password, data.password_hash || '');
    if (!valid) return res.status(401).json({ error: 'Email ou mot de passe incorrect' });

    const token = generateToken({ id: data.id, email: data.email, nom: data.nom, prenom: data.prenom });
    const { password_hash, ...safeData } = data;
    res.json({ token, user: safeData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/auth/me
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('infirmieres')
      .select('*')
      .eq('id', req.user.id)
      .single();
    if (error || !data) return res.status(404).json({ error: 'Infirmière non trouvée' });
    const { password_hash, ...safeData } = data;
    res.json(safeData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/auth/profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const allowed = ['nom', 'prenom', 'telephone', 'commune', 'email_notifications',
      'sms_notifications', 'message_accueil_custom', 'heures_disponibilite',
      'vapi_agent_id', 'numero_telephone_vapi'];
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
