# Hotel Booking System (Frontend)

## 📌 Présentation
Une application web moderne de réservation d'hôtels développée avec **React**, **TypeScript**, **Vite** et **Tailwind CSS**. Ce projet offre une interface utilisateur élégante et responsive, incluant la recherche d'hôtels, la visualisation des détails, la réservation (simulation), la gestion des favoris et des avis utilisateurs.

## 🚀 Technologies Utilisées
- **Core**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Shadcn/ui (Radix UI)
- **Routing**: React Router DOM (v6)
- **État & Gestion**: Context API, LocalStorage
- **Icônes**: Heroicons (via SVG)

## 📂 Structure du Projet
```bash
src/
├── components/         # Composants réutilisables
│   ├── booking/        # Modal et formulaire de réservation/paiement
│   ├── common/         # NavBar, Footer, etc.
│   ├── reviews/        # Liste et formulaire d'avis
│   ├── ui/             # Composants Shadcn (Dialog, Button, etc.)
│   └── HotelCard.tsx   # Carte d'hôtel avec favoris
├── context/            # Gestion d'état global
│   ├── FavoritesContext.tsx # Gestion des favoris
│   └── ReviewsContext.tsx   # Gestion des avis
├── data/               # Données factices (mockData.ts)
├── pages/              # Pages principales (Home, Details, Profile, etc.)
├── types/              # Définitions TypeScript partagées
└── App.tsx             # Configuration des routes et Providers
```

## ✨ Fonctionnalités Principales
1.  **Recherche & Filtrage** : Recherche d'hôtels par destination avec filtres dynamiques.
2.  **Détails de l'Hôtel** : Galerie d'images, liste des chambres, équipements et avis.
3.  **Réservation Complète** : Flux complet incluant sélection de dates, invités et simulation de paiement sécurisé.
4.  **Favoris (Wishlist)** : Ajoutez vos hôtels préférés à votre liste de souhaits (persistant via LocalStorage).
5.  **Avis Clients** : Consultez et ajoutez des avis sur les hôtels (persistant via LocalStorage).
6.  **Authentification** : Pages de Connexion et Inscription (Interface).
7.  **Profil Utilisateur** : Historique des réservations, gestion du profil et accès aux favoris.

## 🛠️ Installation et Démarrage

### Prérequis
- Node.js (v18+) ou Bun (v1+)

### Installation
```bash
# Avec Bun
bun install

# Avec NPM
npm install
```

### Lancement
```bash
bun run dev
# ou
npm run dev
```
L'application sera accessible sur `http://localhost:5173`.

## 📝 Notes pour les Développeurs
- **Données** : Les données sont simulées dans `src/data/mockData.ts`. Il n'y a pas de backend réel connecté.
- **Persistence** : Les favoris et avis sont stockés dans le `localStorage` du navigateur pour persister entre les rafraîchissements.
- **Ajout d'icônes** : Le projet utilise des SVGs inline ou Heroicons.

---
Développé dans le cadre d'un mini-projet académique.
