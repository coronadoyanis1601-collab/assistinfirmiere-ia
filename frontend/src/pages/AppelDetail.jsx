import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/client.js';
import { ArrowLeft, Phone, MapPin, FileText, Clock, AlertTriangle, CheckCircle, Archive, RotateCcw } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const PRIORITE_BADGE = { urgente: 'badge-urgente', haute: 'badge-haute', moyenne: 'badge-moyenne', basse: 'badge-basse' };
const STATUT_BADGE = { nouveau: 'badge-nouveau', 'en-cours': 'badge-en-cours', traite: 'badge-traite', archive: 'badge-archive' };
const PRIORITE_LABEL = { urgente: '🔴 Urgente', haute: '🟠 Haute', moyenne: '🟡 Moyenne', basse: '⚪ Basse' };
const STATUT_LABEL = { nouveau: 'Nouveau', 'en-cours': 'En cours', traite: 'Traité', archive: 'Archivé' };
const CAT_LABEL = {
  'rendez-vous': 'Rendez-vous', soin: 'Soin existant', administratif: 'Administratif',
  'nouveau-patient': 'Nouveau patient', urgence: 'Urgence potentielle', autre: 'Autre',
  'modification-horaire': 'Modification horaire', ordonnance: 'Ordonnance', famille: 'Famille/Aidant'
};

export default function AppelDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appel, setAppel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    api.get(`/api/appels/${id}`).then(({ data }) => { setAppel(data); setNotes(data.notes_infirmiere || ''); }).catch(() => navigate('/app/appels')).finally(() => setLoading(false));
  }, [id]);

  const updateStatut = async (statut) => {
    setUpdating(true);
    try {
      const { data } = await api.put(`/api/appels/${id}/statut`, { statut, notes_infirmiere: notes });
      setAppel(data);
    } catch (err) { console.error(err); }
    finally { setUpdating(false); }
  };

  if (loading) return <div className="flex items-center justify-center h-64 text-slate-400">Chargement...</div>;
  if (!appel) return null;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link to="/app/appels" className="flex items-center gap-2 text-slate-400 hover:text-teal-700 text-sm mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Retour aux appels
        </Link>
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-xl font-bold text-slate-800">{appel.nom_appelant || 'Patient inconnu'}</h1>
          <div className="flex gap-2 flex-shrink-0">
            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${PRIORITE_BADGE[appel.priorite]}`}>
              {PRIORITE_LABEL[appel.priorite]}
            </span>
            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${STATUT_BADGE[appel.statut]}`}>
              {STATUT_LABEL[appel.statut]}
            </span>
          </div>
        </div>
        <p className="text-slate-400 text-sm mt-1">
          {appel.date_appel ? format(new Date(appel.date_appel), "EEEE dd MMMM yyyy 'à' HH:mm", { locale: fr }) : ''}
        </p>
      </div>

      {/* Infos patient */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 mb-4">
        <h2 className="font-semibold text-slate-800 mb-4">Informations du patient</h2>
        <div className="space-y-3">
          {[
            { icon: Phone, label: 'Téléphone', value: appel.telephone_appelant || '—' },
            { icon: MapPin, label: 'Commune', value: appel.commune || '—' },
            { icon: FileText, label: 'Catégorie', value: CAT_LABEL[appel.categorie] || appel.categorie || '—' },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-slate-500" />
              </div>
              <div>
                <div className="text-xs text-slate-400">{label}</div>
                <div className="text-sm font-medium text-slate-700">{value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Motif */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 mb-4">
        <h2 className="font-semibold text-slate-800 mb-3">Motif de l'appel</h2>
        <p className="text-slate-600 text-sm">{appel.motif || 'Non renseigné'}</p>
      </div>

      {/* Résumé IA */}
      {appel.resume && (
        <div className="bg-teal-50 border border-teal-100 rounded-xl p-5 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-teal-700 rounded flex items-center justify-center">
              <FileText className="w-3.5 h-3.5 text-white" />
            </div>
            <h2 className="font-semibold text-teal-800">Résumé structuré</h2>
          </div>
          <p className="text-teal-700 text-sm leading-relaxed">{appel.resume}</p>
        </div>
      )}

      {/* Urgence */}
      {appel.situation_urgente_declaree && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 flex gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-red-700 text-sm">Message prioritaire signalé</div>
            <div className="text-red-600 text-xs mt-1">Le patient a évoqué une situation potentiellement urgente. Rappeler en priorité. En cas d'urgence vitale : <strong>112</strong></div>
          </div>
        </div>
      )}

      {/* Notes */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 mb-4">
        <h2 className="font-semibold text-slate-800 mb-3">Mes notes</h2>
        <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
          placeholder="Ajouter vos notes personnelles sur cet appel..." />
      </div>

      {/* Actions */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h2 className="font-semibold text-slate-800 mb-4">Actions</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          {appel.statut !== 'traite' && (
            <button onClick={() => updateStatut('traite')} disabled={updating}
              className="flex items-center justify-center gap-2 bg-teal-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-teal-800 transition-colors disabled:opacity-50 flex-1">
              <CheckCircle className="w-4 h-4" /> Marquer comme traité
            </button>
          )}
          {appel.statut !== 'en-cours' && appel.statut !== 'traite' && (
            <button onClick={() => updateStatut('en-cours')} disabled={updating}
              className="flex items-center justify-center gap-2 bg-purple-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 flex-1">
              <RotateCcw className="w-4 h-4" /> À rappeler
            </button>
          )}
          {appel.statut !== 'archive' && (
            <button onClick={() => updateStatut('archive')} disabled={updating}
              className="flex items-center justify-center gap-2 border border-slate-200 text-slate-500 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors disabled:opacity-50">
              <Archive className="w-4 h-4" /> Archiver
            </button>
          )}
        </div>
        {appel.statut === 'traite' && (
          <button onClick={() => updateStatut('nouveau')} disabled={updating}
            className="mt-3 text-xs text-slate-400 hover:text-slate-600 transition-colors">
            ↩ Remettre en "Nouveau"
          </button>
        )}
      </div>

      <div className="mt-4 bg-amber-50 border border-amber-100 rounded-xl p-3 flex gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
        <p className="text-amber-700 text-xs">Cet assistant n'évalue pas les situations médicales. Les résumés sont générés automatiquement à partir des informations données par le patient. En cas d'urgence vitale : <strong>112</strong>.</p>
      </div>
    </div>
  );
}
