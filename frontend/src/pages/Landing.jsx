import React from 'react';
import { Link } from 'react-router-dom';
import { PhoneCall, Clock, FileText, ShieldCheck, Bell, ChevronRight, Stethoscope, Star, AlertTriangle } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b border-slate-100 bg-white sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-teal-700 rounded-lg flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-teal-800 text-lg">Assist'Infirmière IA</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-slate-600 hover:text-teal-700 text-sm font-medium">Connexion</Link>
            <Link to="/demo" className="bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-800 transition-colors">Voir la démo</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-teal-800 via-teal-700 to-cyan-700 text-white">
        <div className="max-w-5xl mx-auto px-4 py-16 lg:py-24 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 text-sm mb-6">
            <ShieldCheck className="w-4 h-4" />
            <span>Aucun conseil médical — Prise de message uniquement</span>
          </div>
          <h1 className="text-3xl lg:text-5xl font-bold mb-4 leading-tight">
            Votre assistant téléphonique<br />
            <span className="text-teal-200">pendant vos soins</span>
          </h1>
          <p className="text-teal-100 text-lg max-w-2xl mx-auto mb-8">
            Vous êtes au chevet d'un patient et votre téléphone sonne. Plus d'appels perdus — votre assistant prend le message, structure l'information et vous envoie un résumé clair.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/register" className="bg-white text-teal-800 px-6 py-3 rounded-xl font-semibold hover:bg-teal-50 transition-colors flex items-center justify-center gap-2">
              Demander une démo gratuite <ChevronRight className="w-4 h-4" />
            </Link>
            <Link to="/demo" className="border-2 border-white/50 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/10 transition-colors">
              Voir un exemple d'appel
            </Link>
          </div>
          <div className="mt-8 text-teal-200 text-sm">
            <AlertTriangle className="w-4 h-4 inline mr-1" />
            En cas d'urgence vitale, l'assistant rappelle toujours d'appeler le <strong className="text-white">112</strong>
          </div>
        </div>
      </section>

      {/* Problème / Solution */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="text-red-500 font-semibold text-sm mb-2 uppercase tracking-wide">Le problème</div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Vous ratez des appels chaque jour</h2>
            <ul className="space-y-3 text-slate-600">
              {[
                'Vous êtes en soin et ne pouvez pas décrocher',
                'Les patients racccrochent sans laisser de message',
                'Vous perdez des nouveaux patients potentiels',
                'Les rappels tardifs créent de la frustration',
                'Vous terminez vos journées à rappeler sans savoir pourquoi'
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-red-100 text-red-500 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs">✗</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-teal-600 font-semibold text-sm mb-2 uppercase tracking-wide">La solution</div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Un assistant qui prend vos messages</h2>
            <ul className="space-y-3 text-slate-600">
              {[
                'Répond immédiatement quand vous êtes indisponible',
                'Recueille le nom, la commune et le motif de l'appel',
                'Génère un résumé structuré et lisible',
                'Vous envoie une notification par email',
                'Classe les demandes par priorité pour vous aider à rappeler en ordre'
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Fonctionnalités */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Tout ce qu'il vous faut</h2>
            <p className="text-slate-500">Conçu spécifiquement pour les infirmières indépendantes en Belgique</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: PhoneCall, title: 'Prise de message automatique', desc: 'L'assistant répond en votre nom, recueille les informations essentielles et structure le message.' },
              { icon: FileText, title: 'Résumé structuré par IA', desc: 'Chaque appel génère un résumé clair : patient, commune, motif, priorité. Fini les notes illisibles.' },
              { icon: Bell, title: 'Notification immédiate', desc: 'Recevez un email après chaque appel avec les informations essentielles — même en cours de soin.' },
              { icon: Star, title: 'Classement par priorité', desc: 'Les demandes urgentes sont identifiées et remontées automatiquement en haut de votre liste.' },
              { icon: Clock, title: 'Tableau de bord clair', desc: 'Voyez en un coup d'œil combien d'appels sont à traiter, combien sont prioritaires, les derniers reçus.' },
              { icon: ShieldCheck, title: 'Sécurité et RGPD', desc: 'L'assistant ne donne jamais de conseil médical. Les données sont limitées au strict nécessaire.' },
            ].map((f, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-slate-200">
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-teal-700" />
                </div>
                <h3 className="font-semibold text-slate-800 mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sécurité */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 text-center">
          <ShieldCheck className="w-10 h-10 text-amber-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-amber-900 mb-3">Notre engagement sécurité</h2>
          <p className="text-amber-800 max-w-2xl mx-auto mb-4">
            Assist'Infirmière IA n'est <strong>pas un outil médical</strong>. Il ne pose aucun diagnostic, ne donne aucun conseil médical et ne prend aucune décision clinique. Il prend uniquement des messages et les structure pour vous.
          </p>
          <div className="bg-white rounded-xl p-4 inline-block border border-amber-200">
            <p className="text-red-700 font-semibold text-sm">
              ⚠️ En cas d'urgence vitale, le patient est toujours invité à appeler immédiatement le <strong>112</strong>
            </p>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-teal-800 text-white py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Prête à essayer ?</h2>
          <p className="text-teal-200 mb-8">Inscrivez-vous gratuitement et accédez au tableau de bord en moins de 2 minutes.</p>
          <Link to="/register" className="bg-white text-teal-800 px-8 py-3 rounded-xl font-semibold hover:bg-teal-50 transition-colors inline-flex items-center gap-2">
            Commencer gratuitement <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8 text-center text-slate-400 text-sm">
        <p>© 2024 Assist'Infirmière IA — Outil de prise de message uniquement</p>
        <p className="mt-1">Données collectées uniquement dans le cadre de la gestion des appels — Conformité RGPD</p>
      </footer>
    </div>
  );
}
