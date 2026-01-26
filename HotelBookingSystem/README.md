# Luxotel - Hotel Booking System (Frontend)

## 📌 Présentation
Luxotel est une application web moderne et luxueuse de réservation d'hôtels. Elle offre une expérience complète pour trois types d'utilisateurs : les **Clients**, les **Propriétaires d'hôtels** (Owners) et les **Administrateurs**.

Le projet met l'accent sur une esthétique premium, une navigation fluide et un système robuste de gestion des accès (RBAC).

## 🚀 Technologies Utilisées
- **Core**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Shadcn/ui, Lucide Icons
- **Routing**: React Router DOM (v6) avec Routes Protégées
- **État & Gestion**: 
  - **AuthContext**: Gestion des sessions et rôles (RBAC).
  - **NotificationContext**: Système d'alertes global et temps réel (simulation).
  - **FavoritesContext**: Persistence des coups de cœur (LocalStorage).
  - **ReviewsContext**: Gestion des avis utilisateurs.

## 📂 Espaces Utilisateurs

### 1. Espace Public
- **Navigation**: Recherche d'hôtels, filtres par destination/prix.
- **Détails**: Galerie d'images, équipements, avis et chambres disponibles.
- **Réservation**: Flux de réservation sécurisé (nécessite une connexion).

### 2. Dashboard Client
- **Mes Réservations**: Suivi des séjours passés et à venir.
- **Mes Favoris**: Liste personnalisée des hôtels sauvegardés.
- **Paramètres**: Gestion du profil, sécurité (mot de passe) et préférences de notification.

### 3. Dashboard Propriétaire (Owner)
- **Gestion de l'Hôtel**: Mise à jour des informations, équipements et photos.
- **Gestion des Chambres**: CRUD complet des chambres (types, prix, disponibilité).
- **Réservations**: Confirmation ou annulation des demandes clients avec notifications automatiques.
- **Finance**: Aperçu des revenus et statistiques simples.

### 4. Dashboard Administrateur (Admin)
- **Analytics**: Graphiques de performance globale du système.
- **Utilisateurs**: Gestion des rôles et comptes.
- **Système**: Configuration globale et promotions.

## 🔑 Comptes de Test
Utilisez ces identifiants pour explorer les différents dashboards :

| Rôle | Email | Mot de passe |
| :--- | :--- | :--- |
| **Administrateur** | `admin@luxotel.com` | `admin` |
| **Propriétaire** | `owner@hotel.com` | `owner` |
| **Client** | `client@user.com` | `user` |

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

## 📝 Notes Techniques
- **Données**: Entièrement simulées via `src/data/mockData.ts`.
- **Persistence**: Les favoris, avis et sessions utilisateur sont conservés via le `LocalStorage`.
- **RBAC**: Les routes `/admin`, `/owner` et `/profile` sont protégées. Si un utilisateur non autorisé tente d'y accéder, il est redirigé vers sa page d'accueil respective.

---
Développé dans le cadre d'un mini-projet académique sur les systèmes de réservation.
