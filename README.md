# Fetia

Des cartes d'invitation et de fete trop belles — anniversaire, invitation, mariage, naissance — creees en ligne, personnalisees en direct, et partagees en un lien.

## Stack

- **Frontend** : Nuxt 3, Vue 3, Tailwind CSS, Pinia
- **Backend** : NestJS, TypeORM, PostgreSQL, Passport/JWT
- **Paiement** : Stripe Checkout (modeles premium)
- **Infra** : Docker / docker-compose

## Fonctionnalites (MVP)

- Galerie de modeles filtrable par categorie (anniversaire, fete, invitation, mariage, naissance)
- Editeur avec apercu live de la carte (titre, sous-titre, message, date, lieu, mot de fin, programme)
- Comptes utilisateurs (inscription / connexion par JWT)
- Cartes gratuites et cartes premium debloquees via Stripe Checkout
- Page publique de carte avec ouverture animee et sections supplementaires qui se devoilent au scroll (`/c/:slug`)
- Tableau de bord "Mes cartes"

### Le systeme de carte magique (`MagicReveal`)

Chaque carte s'ouvre avec une animation propre a sa categorie (sceau de cire pour les invitations,
eclosion florale pour les mariages, envolee de nuages pour les naissances, sunrise pour les anniversaires,
explosion de confettis pour les fetes), avec des particules lumineuses en continu (`AmbientMagic`) et un
texte qui scintille. Une fois ouverte, la carte peut se derouler comme un mini-site : date, lieu, programme
(`timeline`) et mot de fin, chaque section apparaissant au scroll (`useScrollReveal`). Ces champs sont
optionnels : une carte simple n'affiche que l'essentiel, une carte plus riche (mariage, invitation) peut
raconter toute la journee.

Au premier lancement (ou apres une mise a jour des modeles), relance le seed pour rafraichir les modeles :

```bash
npm run seed   # met a jour les 6 modeles existants avec leurs nouveaux champs
```

## Demarrer en local

### Avec Docker (recommande)

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
docker compose up --build
```

- Frontend : http://localhost:3000
- API : http://localhost:3001/api

Au premier lancement, seed les modeles de cartes :

```bash
docker compose exec backend npm run seed
```

### Sans Docker

**Backend**

```bash
cd backend
cp .env.example .env   # renseigner DATABASE_URL vers un Postgres local
npm install
npm run start:dev
npm run seed            # dans un autre terminal, une fois la DB prete
```

**Frontend**

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

## Paiement Stripe

Les clefs sont a renseigner dans `backend/.env` :

```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

En local, pour recevoir les evenements webhook :

```bash
stripe listen --forward-to localhost:3001/api/payments/webhook
```

## Structure

```
fetia/
  backend/    # API NestJS (auth, templates, cards, payments)
  frontend/   # App Nuxt 3 (landing, editeur, dashboard)
  docker-compose.yml
```

## Roadmap possible

- Upload de photo dans les cartes (S3 / Cloudinary)
- Export PDF / impression
- Domaine personnalise par carte
- Abonnement mensuel (au lieu du paiement a l'unite)
