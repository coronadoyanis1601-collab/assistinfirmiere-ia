import React, { useState, useEffect } from 'react';
import api from '../api/client.js';
import { Settings, Save, RefreshCw, CheckCircle, Mic, Bell, ShieldCheck } from 'lucide-react';

const DEFAULT_GREETING = (prenom, nom) => `Bonjour, vous êtes bien sur l'assistant téléphonique de ${prenom} ${nom}, infirmière indépendante. Je vais prendre votre message afin qu'elle puisse vous recontacter. En cas d'urgence vitale, veuillez appeler immédiatement le 112.`;
const SAFETY_MSG = "Je ne peux pas évaluer une situation médicale. Si la situation est urgente ou vitale, appelez immédiatement le 112.";

export default function Configuration() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    api.get('/api/infirmieres/config').then(({ data }) => {
      setConfig(data);
      setForm({
        nom: data.nom || '',
        prenom: data.prenom || '',
        telephone: data.telephone || '',
        commune: data.commune || '',
        message_accueil_custom: data.message_accueil_custom || DEFAULT_GREETING(data.prenom, data.nom),
        heures_disponibilite: data.heures_disponibilite || 'Lundi–Vendredi 8h–18h',
        email_notifications: data.email_notifications ?? true,
        sms_notifications: data.sms_notifications ?? false,
        vapi_agent_id: data.vapi_agent_id || '',
        numero_telephone_vapi: data.numero_telephone_vapi || '',
      });
    }).finally(() => setLoading(false));
  }, []);

  const handleSave = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/api/infirmieres/config', form);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const Field = ({ label, name, type = 'text', placeholder, help }) => (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      <input type={type} value={form[name] || ''} onChange={e => setForm({...form, [name]: e.target.value})}
        className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
        placeholder={placeholder} />
      {help && <p className="text-xs text-slate-400 mt-1">{help}</p>}
    </div>
  );

  if (loading) return <div className="flex items-center justify-center h-64 text-slate-400">Chargement...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-800">Configuration de l'assistant</h1>
        <p className="text-slate-500 text-sm mt-1">Personnalisez le comportement de votre assistant vocal</p>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        {/* Profil */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="w-4 h-4 text-teal-700" />
            <h2 className="font-semibold text-slate-800">Mon profil</h2>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <Field label="Prénom" name="prenom" placeholder="Marie" />
            <Field label="Nom" name="nom" placeholder="Dupont" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Téléphone" name="telephone" type="tel" placeholder="+32 470 00 00 00" />
            <Field label="Commune principale" name="commune" placeholder="Bruxelles" />
          </div>
        </div>

        {/* Message d'accueil */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Mic className="w-4 h-4 text-teal-700" />
            <h2 className="font-semibold text-slate-800">Message d'accueil</h2>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Texte lu par l'assistant</label>
            <textarea value={form.message_accueil_custom || ''} onChange={e => setForm({...form, message_accueil_custom: e.target.value})}
              rows={4}
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none resize-none" />
            <p className="text-xs text-slate-400 mt-1">Ce message sera lu à vos appelants quand l'assistant prend l'appel.</p>
          </div>
          <div className="mt-3">
            <label className="block text-sm font-medium text-slate-700 mb-1">Horaires d'activation</label>
            <input value={form.heures_disponibilite || ''} onChange={e => setForm({...form, heures_disponibilite: e.target.value})}
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 outline-none"
              placeholder="Ex : Lundi–Vendredi 8h–18h" />
          </div>
          <div className="mt-3 bg-amber-50 border border-amber-100 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-semibold text-amber-700">Message de sécurité (obligatoire — non modifiable)</span>
            </div>
            <p className="text-xs text-amber-700 italic">"{SAFETY_MSG}"</p>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-4 h-4 text-teal-700" />
            <h2 className="font-semibold text-slate-800">Notifications</h2>
          </div>
          <div className="space-y-3">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <div className="text-sm font-medium text-slate-700">Notification par email</div>
                <div className="text-xs text-slate-400">Recevoir un email après chaque appel</div>
              </div>
              <div className="relative">
                <input type="checkbox" checked={form.email_notifications} onChange={e => setForm({...form, email_notifications: e.target.checked})} className="sr-only" />
                <div className={`w-10 h-6 rounded-full transition-colors ${form.email_notifications ? 'bg-teal-600' : 'bg-slate-200'}`} onClick={() => setForm({...form, email_notifications: !form.email_notifications})}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.email_notifications ? 'translate-x-5' : 'translate-x-1'}`} />
                </div>
              </div>
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <div className="text-sm font-medium text-slate-700">Notification SMS</div>
                <div className="text-xs text-slate-400">Recevoir un SMS pour les appels urgents</div>
              </div>
              <div className="relative">
                <input type="checkbox" checked={form.sms_notifications} onChange={e => setForm({...form, sms_notifications: e.target.checked})} className="sr-only" />
                <div className={`w-10 h-6 rounded-full transition-colors ${form.sms_notifications ? 'bg-teal-600' : 'bg-slate-200'}`} onClick={() => setForm({...form, sms_notifications: !form.sms_notifications})}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.sms_notifications ? 'translate-x-5' : 'translate-x-1'}`} />
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Vapi */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-2 mb-1">
            <Mic className="w-4 h-4 text-teal-700" />
            <h2 className="font-semibold text-slate-800">Connexion Vapi (technique)</h2>
          </div>
          <p className="text-xs text-slate-400 mb-4">Ces informations sont configurées par votre administrateur.</p>
          <div className="grid grid-cols-1 gap-3">
            <Field label="ID Agent Vapi" name="vapi_agent_id" placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
              help="L'identifiant unique de votre agent vocal sur Vapi.ai" />
            <Field label="Numéro de téléphone Vapi" name="numero_telephone_vapi" placeholder="+32460231303"
              help="Le numéro Twilio/Vapi attribué à votre assistant" />
          </div>
        </div>

        <button type="submit" disabled={saving}
          className="w-full bg-teal-700 text-white py-3 rounded-xl font-semibold hover:bg-teal-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
          {saving ? <><RefreshCw className="w-4 h-4 animate-spin" /> Enregistrement...</> :
           saved ? <><CheckCircle className="w-4 h-4" /> Enregistré !</> :
           <><Save className="w-4 h-4" /> Enregistrer les modifications</>}
        </button>
      </form>
    </div>
  );
}
