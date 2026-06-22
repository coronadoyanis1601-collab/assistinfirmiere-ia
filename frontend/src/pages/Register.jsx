import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../App.jsx';
import api from '../api/client.js';
import { Stethoscope, ShieldCheck } from 'lucide-react';

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ prenom: '', nom: '', email: '', telephone: '', commune: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    if (form.password !== form.confirm) { setError('Les mots de passe ne correspondent pas'); return; }
    if (form.password.length < 8) { setError('Le mot de passe doit contenir au moins 8 caractères'); return; }
    setLoading(true); setError('');
    try {
      const { data } = await api.post('/api/auth/register', {
        prenom: form.prenom, nom: form.nom, email: form.email,
        telephone: form.telephone, commune: form.commune, password: form.password
      });
      login(data.user, data.token);
      navigate('/app');
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de l\'inscription');
    } finally { setLoading(false); }
  };

  const Field = ({ label, name, type = 'text', placeholder, required = true }) => (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}{required && ' *'}</label>
      <input type={type} required={required} value={form[name]} onChange={e => setForm({...form, [name]: e.target.value})}
        className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
        placeholder={placeholder} />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-teal-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Stethoscope className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-xl font-bold text-slate-800">Créer votre compte</h1>
          <p className="text-slate-500 text-sm mt-1">Accès gratuit — Aucune carte requise</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Prénom" name="prenom" placeholder="Marie" />
            <Field label="Nom" name="nom" placeholder="Dupont" />
          </div>
          <Field label="Email professionnel" name="email" type="email" placeholder="votre@email.be" />
          <Field label="Téléphone" name="telephone" type="tel" placeholder="+32 470 00 00 00" required={false} />
          <Field label="Commune principale" name="commune" placeholder="Bruxelles, Liège..." required={false} />
          <Field label="Mot de passe" name="password" type="password" placeholder="Minimum 8 caractères" />
          <Field label="Confirmer le mot de passe" name="confirm" type="password" placeholder="••••••••" />

          {error && <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg">{error}</div>}

          <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 flex gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-amber-700 text-xs">En cas d'urgence vitale, l'assistant rappelle toujours au patient d'appeler le 112. Cet outil ne donne aucun conseil médical.</p>
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-teal-700 text-white py-2.5 rounded-lg font-semibold hover:bg-teal-800 transition-colors disabled:opacity-50">
            {loading ? 'Création du compte...' : 'Créer mon compte'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-4">
          Déjà un compte ? <Link to="/login" className="text-teal-700 font-medium hover:underline">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}
