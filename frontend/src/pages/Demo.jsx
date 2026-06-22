import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PhoneCall, PhoneIncoming, CheckCircle, AlertTriangle, ArrowLeft, Play, Stethoscope } from 'lucide-react';

const DEMO_APPEL = {
  nom_appelant: 'Marie Dupont',
  telephone_appelant: '0470 00 00 00',
  commune: 'Anderlecht',
  motif: 'Souhaite déplacer son soin de pansement prévu demain matin',
  categorie: 'Modification horaire',
  priorite: 'moyenne',
  statut: 'Nouveau',
  resume: "Marie Dupont, Anderlecht, souhaite déplacer son soin de pansement prévu demain matin. Urgence non signalée. Action recommandée : rappeler Mme Dupont pour confirmer un nouvel horaire.",
  action: "Rappeler Mme Dupont au 0470 00 00 00 pour confirmer un nouvel horaire de soin.",
  date: new Date().toLocaleDateString('fr-BE', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })
};

export default function Demo() {
  const [step, setStep] = useState(0); // 0=intro, 1=appel entrant, 2=en cours, 3=résultat

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-slate-100">
      {/* Nav */}
      <nav className="bg-white border-b border-slate-100 px-4 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 text-slate-500 hover:text-teal-700 text-sm">
            <ArrowLeft className="w-4 h-4" /> Accueil
          </Link>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-teal-700 rounded-lg flex items-center justify-center">
              <Stethoscope className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-teal-800 text-sm">Assist&apos;Infirmière IA</span>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-700 rounded-full px-4 py-1.5 text-sm font-medium mb-4">
            <Play className="w-4 h-4" /> Démonstration interactive
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Voyez l&apos;assistant en action</h1>
          <p className="text-slate-500">Simulez un appel reçu pendant que vous êtes en soin</p>
        </div>

        {step === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
            <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <PhoneCall className="w-10 h-10 text-teal-700" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-3">Scénario</h2>
            <p className="text-slate-600 mb-6 max-w-md mx-auto">
              Vous êtes en soin chez un patient. Marie Dupont appelle pour modifier un rendez-vous. L'assistant prend l&apos;appel à votre place.
            </p>
            <button onClick={() => setStep(1)}
              className="bg-teal-700 text-white px-8 py-3 rounded-xl font-semibold hover:bg-teal-800 transition-colors flex items-center gap-2 mx-auto">
              <PhoneIncoming className="w-5 h-5" /> Simuler un appel entrant
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="bg-white rounded-2xl border-2 border-teal-400 p-8 text-center animate-pulse">
            <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6 ring-4 ring-teal-200 ring-offset-4">
              <PhoneIncoming className="w-10 h-10 text-teal-600" />
            </div>
            <div className="text-slate-400 text-sm mb-2">Appel entrant</div>
            <div className="text-2xl font-bold text-slate-800 mb-1">0470 00 00 00</div>
            <div className="text-slate-500 mb-8">Vous êtes en soin — l&apos;assistant répond automatiquement</div>
            <button onClick={() => setStep(2)}
              className="bg-teal-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-teal-800 transition-colors">
              ▶ L&apos;assistant décroche et prend le message...
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-teal-700" />
              </div>
              <div>
                <div className="font-semibold text-slate-800">Assistant vocal actif</div>
                <div className="text-xs text-teal-600 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse inline-block" /> En communication...
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-5 mb-6 space-y-3 text-sm">
              <div className="flex gap-3">
                <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold text-teal-700">A</div>
                <div className="bg-teal-50 rounded-xl rounded-tl-none p-3 text-teal-800 flex-1">
                  "Bonjour, vous êtes bien sur l'assistant de Marie Defays, infirmière indépendante. Je vais prendre votre message. En cas d&apos;urgence vitale, appelez le 112. Quel est votre prénom et nom ?"
                </div>
              </div>
              <div className="flex gap-3 flex-row-reverse">
                <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold text-slate-500">P</div>
                <div className="bg-white border border-slate-200 rounded-xl rounded-tr-none p-3 text-slate-700 flex-1 text-right">
                  "Bonjour, c'est Marie Dupont d&apos;Anderlecht."
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold text-teal-700">A</div>
                <div className="bg-teal-50 rounded-xl rounded-tl-none p-3 text-teal-800 flex-1">
                  "Merci Madame Dupont. Quel est le motif de votre appel ?"
                </div>
              </div>
              <div className="flex gap-3 flex-row-reverse">
                <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold text-slate-500">P</div>
                <div className="bg-white border border-slate-200 rounded-xl rounded-tr-none p-3 text-slate-700 flex-1 text-right">
                  "Je voudrais déplacer mon soin de pansement prévu demain matin."
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold text-teal-700">A</div>
                <div className="bg-teal-50 rounded-xl rounded-tl-none p-3 text-teal-800 flex-1">
                  "Très bien, j&apos;ai bien noté votre demande. Marie Defays vous rappellera dans les meilleurs délais. Bonne journée !"
                </div>
              </div>
            </div>

            <button onClick={() => setStep(3)}
              className="w-full bg-teal-700 text-white py-3 rounded-xl font-semibold hover:bg-teal-800 transition-colors">
              Voir le résumé généré →
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            {/* Notification email */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="font-semibold text-slate-800">Notification email envoyée</span>
                <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">Priorité : Moyenne</span>
              </div>
              <div className="bg-slate-50 rounded-lg p-4 text-sm space-y-1.5 font-mono text-slate-600">
                <div><strong>De :</strong> Assist&apos;Infirmière IA</div>
                <div><strong>Objet :</strong> 📞 Nouvel appel — Priorité moyenne</div>
                <div className="border-t border-slate-200 pt-3 mt-3 space-y-1">
                  <div><strong>Patient :</strong> {DEMO_APPEL.nom_appelant}</div>
                  <div><strong>Téléphone :</strong> {DEMO_APPEL.telephone_appelant}</div>
                  <div><strong>Commune :</strong> {DEMO_APPEL.commune}</div>
                  <div><strong>Motif :</strong> {DEMO_APPEL.motif}</div>
                  <div><strong>Priorité :</strong> 🟡 {DEMO_APPEL.priorite}</div>
                </div>
              </div>
            </div>

            {/* Fiche appel */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-slate-800">Fiche d&apos;appel</h2>
                <div className="flex gap-2">
                  <span className="text-xs px-2.5 py-1 rounded-full font-medium badge-moyenne">🟡 Moyenne</span>
                  <span className="text-xs px-2.5 py-1 rounded-full font-medium badge-nouveau">Nouveau</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                <div><span className="text-slate-400">Patient</span><div className="font-medium">{DEMO_APPEL.nom_appelant}</div></div>
                <div><span className="text-slate-400">Téléphone</span><div className="font-medium">{DEMO_APPEL.telephone_appelant}</div></div>
                <div><span className="text-slate-400">Commune</span><div className="font-medium">{DEMO_APPEL.commune}</div></div>
                <div><span className="text-slate-400">Catégorie</span><div className="font-medium">{DEMO_APPEL.categorie}</div></div>
              </div>
              <div className="bg-teal-50 rounded-lg p-4 border border-teal-100">
                <div className="text-xs font-semibold text-teal-600 mb-2 uppercase tracking-wide">Résumé structuré</div>
                <p className="text-teal-800 text-sm">{DEMO_APPEL.resume}</p>
              </div>
              <div className="mt-3 bg-blue-50 rounded-lg p-3 border border-blue-100">
                <div className="text-xs font-semibold text-blue-600 mb-1">Action recommandée (non médicale)</div>
                <p className="text-blue-800 text-sm">{DEMO_APPEL.action}</p>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
              <p className="text-amber-700 text-sm">Cet assistant ne pose aucun diagnostic et ne donne aucun conseil médical. En cas d&apos;urgence vitale, le patient est invité à appeler le <strong>112</strong>.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={() => setStep(0)} className="flex-1 border border-slate-200 text-slate-600 py-2.5 rounded-xl font-medium hover:bg-slate-50 transition-colors">
                Recommencer la démo
              </button>
              <Link to="/register" className="flex-1 bg-teal-700 text-white py-2.5 rounded-xl font-semibold hover:bg-teal-800 transition-colors text-center">
                Créer mon compte gratuit →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
