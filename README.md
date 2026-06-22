# Assist'Infirmière IA

Assistant téléphonique IA pour infirmières indépendantes en Belgique francophone.

## Stack
- **Frontend** : React + Vite + TailwindCSS → Railway
- **Backend** : Node.js + Express → Railway
- **Base de données** : Supabase (PostgreSQL)
- **Agent vocal** : Vapi.ai + Twilio

## Structure
```
assistinfirmiere-ia/
├── frontend/     # React app (Landing, Dashboard, Appels, Config, Démo)
├── backend/      # Express API (Auth, Appels, Stats, Webhook)
```

## Variables d'environnement

### Backend
```
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=eyJ...
JWT_SECRET=votre_secret_jwt
FRONTEND_URL=https://votre-frontend.railway.app
SMTP_HOST=smtp.gmail.com (optionnel)
SMTP_PORT=587
SMTP_USER=votre@email.com
SMTP_PASS=votre_mot_de_passe_app
```

### Frontend
```
VITE_API_URL=https://votre-backend.railway.app
```

## Webhook Vapi
`POST /api/webhook/vapi` — reçoit les données d'appel terminé

## Sécurité
- Aucun conseil médical
- Redirection 112 systématique pour urgences
- RGPD : données minimales collectées
