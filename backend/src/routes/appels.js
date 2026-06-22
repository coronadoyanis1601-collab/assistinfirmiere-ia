import express from 'express';
import { supabase } from '../supabase.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// GET /api/appels — liste des appels de l'infirmière connectée
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { priorite, statut, categorie, date_debut, date_fin, commune, limit = 50, offset = 0 } = req.query;
    let query = supabase
      .from('appels')
      .select('*')
      .eq('infirmiere_id', req.user.id)
      .order('date_appel', { ascending: false })
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    if (priorite) query = query.eq('priorite', priorite);
    if (statut) query = query.eq('statut', statut);
    if (categorie) query = query.eq('categorie', categorie);
    if (commune) query = query.ilike('commune', `%${commune}%`);
    if (date_debut) query = query.gte('date_appel', date_debut);
    if (date_fin) query = query.lte('date_appel', date_fin);

    const { data, error } = await query;
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/appels/:id
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('appels')
      .select('*')
      .eq('id', req.params.id)
      .eq('infirmiere_id', req.user.id)
      .single();
    if (error || !data) return res.status(404).json({ error: 'Appel non trouvé' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/appels/:id/statut
router.put('/:id/statut', authMiddleware, async (req, res) => {
  try {
    const { statut, notes_infirmiere } = req.body;
    const allowed = ['nouveau', 'en-cours', 'traite', 'archive'];
    if (!allowed.includes(statut)) return res.status(400).json({ error: 'Statut invalide' });

    const updates = { statut };
    if (notes_infirmiere !== undefined) updates.notes_infirmiere = notes_infirmiere;

    const { data, error } = await supabase
      .from('appels')
      .update(updates)
      .eq('id', req.params.id)
      .eq('infirmiere_id', req.user.id)
      .select()
      .single();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/appels/:id (archive only for RGPD)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { error } = await supabase
      .from('appels')
      .update({ statut: 'archive' })
      .eq('id', req.params.id)
      .eq('infirmiere_id', req.user.id);
    if (error) throw error;
    res.json({ message: 'Appel archivé' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
