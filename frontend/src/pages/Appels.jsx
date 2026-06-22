import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client.js';
import { PhoneCall, Filter, Search, ChevronRight, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const PRIORITE_BADGE = { urgente: 'badge-urgente', haute: 'badge-haute', moyenne: 'badge-moyenne', basse: 'badge-basse' };
const STATUT_BADGE = { nouveau: 'badge-nouveau', 'en-cours': 'badge-en-cours', traite: 'badge-traite', archive: 'badge-archive' };
const P_LABEL = { urgente: '🔴 Urgente', haute: '🟠 Haute', moyenne: '🟡 Moyenne', basse: '⚪ Basse' };
const S_LABEL = { nouveau: 'Nouveau', 'en-cours': 'En cours', traite: 'Traité', archive: 'Archivé' };
const CAT_LABEL = {
  'rendez-vous': 'Rendez-vous', soin: 'Soin existant', administratif: 'Administratif',
  'nouveau-patient': 'Nouveau patient', urgence: 'Urgence potentielle', autre: 'Autre',
  'modification-horaire': 'Modification horaire', ordonnance: 'Ordonnance', famille: 'Famille/Aidant'
};

export default function Appels() {
  const [appels, setAppels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ priorite: '', statut: '', categorie: '', commune: '' });
  const [showFilters, setShowFilters] = useState(false);

  const loadAppels = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });
      const { data } = await api.get('/api/appels', { params });
      setAppels(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [filters]);

  useEffect(() => { loadAppels(); }, [loadAppels]);

  const activeFilters = Object.values(filters).filter(Boolean).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Appels reçus</h1>
          <p className="text-slate-500 text-sm mt-0.5">{appels.length} appel(s) trouvé(s)</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${showFilters || activeFilters ? 'bg-teal-50 border-teal-200 text-teal-700' : 'bg-white border-slate-200 text-slate-600'}`}>
            <Filter className="w-4 h-4" />
            Filtres {activeFilters > 0 && <span className="bg-teal-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">{activeFilters}</span>}
          </button>
          <button onClick={loadAppels} className="p-2 rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-teal-700">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { key: 'priorite', label: 'Priorité', options: [['urgente','🔴 Urgente'],['haute','🟠 Haute'],['moyenne','🟡 Moyenne'],['basse','⚪ Basse']] },
              { key: 'statut', label: 'Statut', options: [['nouveau','Nouveau'],['en-cours','En cours'],['traite','Traité'],['archive','Archivé']] },
              { key: 'categorie', label: 'Catégorie', options: Object.entries(CAT_LABEL) },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-xs font-medium text-slate-500 mb-1">{f.label}</label>
                <select value={filters[f.key]} onChange={e => setFilters({...filters, [f.key]: e.target.value})}
                  className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-sm">
                  <option value="">Tous</option>
                  {f.options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
            ))}
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Commune</label>
              <input value={filters.commune} onChange={e => setFilters({...filters, commune: e.target.value})}
                placeholder="Rechercher..."
                className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-sm" />
            </div>
          </div>
          {activeFilters > 0 && (
            <button onClick={() => setFilters({ priorite: '', statut: '', categorie: '', commune: '' })}
              className="mt-3 text-xs text-slate-400 hover:text-red-500 transition-colors">
              Effacer tous les filtres
            </button>
          )}
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-400 text-sm">Chargement des appels...</div>
        ) : !appels.length ? (
          <div className="p-12 text-center">
            <PhoneCall className="w-12 h-12 text-slate-200 mx-auto mb-3" />
            <p className="text-slate-400 font-medium">Aucun appel{activeFilters ? ' avec ces filtres' : ''}</p>
            <p className="text-slate-300 text-sm mt-1">Les appels de votre assistant vocal apparaîtront ici</p>
          </div>
        ) : (
          <>
            {/* Header desktop */}
            <div className="hidden lg:grid grid-cols-12 gap-4 px-4 py-3 bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <div className="col-span-3">Patient</div>
              <div className="col-span-3">Motif</div>
              <div className="col-span-2">Commune</div>
              <div className="col-span-1">Priorité</div>
              <div className="col-span-1">Statut</div>
              <div className="col-span-2">Date</div>
            </div>
            <div className="divide-y divide-slate-50">
              {appels.map(appel => (
                <Link key={appel.id} to={`/app/appels/${appel.id}`}
                  className="flex lg:grid lg:grid-cols-12 gap-3 lg:gap-4 items-center px-4 py-3.5 hover:bg-slate-50 transition-colors group">
                  {/* Mobile */}
                  <div className="lg:hidden w-9 h-9 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <PhoneCall className="w-4 h-4 text-teal-600" />
                  </div>
                  <div className="lg:col-span-3 flex-1 min-w-0">
                    <div className="font-medium text-slate-800 text-sm truncate">{appel.nom_appelant || 'Inconnu'}</div>
                    <div className="text-xs text-slate-400 truncate">{appel.telephone_appelant}</div>
                  </div>
                  <div className="hidden lg:block lg:col-span-3 text-sm text-slate-600 truncate">{appel.motif || '—'}</div>
                  <div className="hidden lg:block lg:col-span-2 text-sm text-slate-500 truncate">{appel.commune || '—'}</div>
                  <div className="lg:col-span-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${PRIORITE_BADGE[appel.priorite]}`}>
                      {appel.priorite === 'urgente' ? '🔴' : appel.priorite === 'haute' ? '🟠' : appel.priorite === 'moyenne' ? '🟡' : '⚪'}
                      <span className="hidden lg:inline ml-1">{['haute','urgente'].includes(appel.priorite) ? P_LABEL[appel.priorite].split(' ')[1] : ''}</span>
                    </span>
                  </div>
                  <div className="hidden lg:block lg:col-span-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUT_BADGE[appel.statut]}`}>
                      {S_LABEL[appel.statut]}
                    </span>
                  </div>
                  <div className="hidden lg:flex lg:col-span-2 items-center justify-between">
                    <span className="text-xs text-slate-400">
                      {appel.date_appel ? format(new Date(appel.date_appel), 'dd/MM/yy HH:mm', { locale: fr }) : '—'}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-teal-600 transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
