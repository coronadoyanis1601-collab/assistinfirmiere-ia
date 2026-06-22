import express from 'express';
import { supabase } from '../supabase.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// GET /api/stats/dashboard
router.get('/dashboard', authMiddleware, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayISO = today.toISOString();

    const [totalRes, todayRes, nonTraitesRes, urgentsRes, dernierRes] = await Promise.all([
      supabase.from('appels').select('id', { count: 'exact', head: true }).eq('infirmiere_id', req.user.id),
      supabase.from('appels').select('id', { count: 'exact', head: true }).eq('infirmiere_id', req.user.id).gte('date_appel', todayISO),
      supabase.from('appels').select('id', { count: 'exact', head: true }).eq('infirmiere_id', req.user.id).in('statut', ['nouveau', 'en-cours']),
      supabase.from('appels').select('id', { count: 'exact', head: true }).eq('infirmiere_id', req.user.id).eq('priorite', 'urgente').in('statut', ['nouveau', 'en-cours']),
      supabase.from('appels').select('*').eq('infirmiere_id', req.user.id).order('date_appel', { ascending: false }).limit(5)
    ]);

    res.json({
      total_appels: totalRes.count || 0,
      appels_aujourd_hui: todayRes.count || 0,
      appels_non_traites: nonTraitesRes.count || 0,
      appels_urgents: urgentsRes.count || 0,
      derniers_appels: dernierRes.data || []
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
