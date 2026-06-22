import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../App.jsx';
import api from '../api/client.js';
import { PhoneCall, AlertTriangle, Clock, CheckCircle, ChevronRight, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const PRIORITE_BADGE = {
  urgente: 'badge-urgente', haute: 'badge-haute', moyenne: 'badge-moyenne', basse: 'badge-basse'
};
const STATUT_BADGE = {
  nouveau: 'badge-nouveau', 'en-cours': 'badge-en-cours', traite: 'badge-traite', archive: 'badge-archive'
};
const PRIORITE_LABEL = { urgente: 'Urgente', haute: 'Haute', moyenne: 'Moyenne', basse: 'Basse' };
const STATUT_LABEL = { nouveau: 'Nouveau', 'en-cours': 'En cours', traite: 'Traité', archive: 'Archivé' };

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/stats/dashboard');
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  };

  useEffect(() => { loadStats(); }, []);

  const StatCard = ({ icon: Icon, label, value, color, bg }) => (
    <div className={`bg-white rounded-xl border border-slate-200 p-5`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-slate-500 text-sm font-medium">{label}</span>
        <div className={`w-9 h-9 ${bg} rounded-lg flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
      </div>
      <div className={`text-3xl font-bold ${color}`}>{loading ? '—' : value}</div>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Bonjour, {user?.prenom} 👋</h1>
          <p className="text-slate-500 text-sm mt-0.5">Voici l'état de vos appels aujourd&apos;hui</p>
        </div>
        <button onClick={loadStats} className="text-slate-400 hover:text-teal-700 transition-colors">
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={PhoneCall} label="Aujourd'hui" value={stats?.appels_aujourd_hui ?? 0} color="text-teal-700" bg="bg-teal-50" />
        <StatCard icon={Clock} label="À traiter" value={stats?.appels_non_traites ?? 0} color="text-orange-600" bg="bg-orange-50" />
        <StatCard icon={AlertTriangle} label="Prioritaires" value={stats?.appels_urgents ?? 0} color="text-red-600" bg="bg-red-50" />
        <StatCard icon={CheckCircle} label="Total appels" value={stats?.total_appels ?? 0} color="text-slate-600" bg="bg-slate-100" />
      </div>

      {/* Derniers appels */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-800">Derniers appels reçus</h2>
          <Link to="/app/appels" className="text-teal-700 text-sm font-medium flex items-center gap-1 hover:underline">
            Voir tout <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-400 text-sm">Chargement...</div>
        ) : !stats?.derniers_appels?.length ? (
          <div className="p-8 text-center">
            <PhoneCall className="w-10 h-10 text-slate-200 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">Aucun appel reçu pour l&apos;instant</p>
            <p className="text-slate-300 text-xs mt-1">Les appels de votre assistant apparaîtront ici</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {stats.derniers_appels.map(appel => (
              <Link key={appel.id} to={`/app/appels/${appel.id}`}
                className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 transition-colors">
                <div className="w-9 h-9 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <PhoneCall className="w-4 h-4 text-teal-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-slate-800 text-sm truncate">{appel.nom_appelant || 'Inconnu'}</div>
                  <div className="text-slate-400 text-xs truncate">{appel.motif || 'Motif non précisé'} — {appel.commune || '-'}</div>
                </div>
                <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${PRIORITE_BADGE[appel.priorite]}`}>
                    {PRIORITE_LABEL[appel.priorite]}
                  </span>
                  <span className="text-slate-300 text-xs">
                    {appel.date_appel ? format(new Date(appel.date_appel), 'dd/MM HH:mm', { locale: fr }) : ''}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Rappel sécurité */}
      <div className="mt-6 bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-amber-800">
          <strong>Rappel :</strong> Cet assistant prend uniquement des messages et génère des résumés. Il ne donne aucun conseil médical. En cas d&apos;urgence vitale signalée, le patient est invité à appeler le <strong>112</strong>.
        </div>
      </div>
    </div>
  );
}
