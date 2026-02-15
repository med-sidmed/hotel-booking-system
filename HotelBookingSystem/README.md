# Luxotel - Hotel Booking System (Frontend)

## 📌 Présentation
Luxotel est une application web moderne et luxueuse de réservation d'hôtels. Elle offre une expérience complète et fluide pour trois types d'utilisateurs : les **Clients**, les **Propriétaires d'hôtels** (Owners) et les **Administrateurs**.

Le projet met l'accent sur une esthétique premium, une navigation intuitive et un système robuste de gestion des accès (RBAC).

## 🚀 Technologies Utilisées
- **Core**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS v4, Shadcn/ui (Radix UI), Lucide Icons
- **Animation**: Framer Motion
- **Routing**: React Router DOM v7
- **Data Visualization**: Recharts (pour les dashboards)
- **Internationalisation**: i18next (Support multilingue)
- **Gestion d'État**: Context API (Auth, Notifications, Favorites, Reviews, Chat)

## 📂 Fonctionnalités par Rôle

### 1️⃣ Espace Public (Tous les visiteurs)
*   **Recherche Avancée**: Filtrage des hôtels par destination, prix, note et équipements.
*   **Page Détails Hôtel**:
    *   Galerie photos immersive.
    *   Liste des équipements (Wi-Fi, Piscine, etc.).
    *   Carte interactive de localisation.
    *   Avis clients vérifiés.
    *   Sélection des chambres disponibles avec prix en temps réel.
*   **Support Multilingue**: Interface entièrement traduite (Français, Anglais, Arabe).
*   **Thème**: Support du mode Sombre/Clair.

### 2️⃣ Espace Client
*   **Gestion des Réservations**:
    *   Suivi des statuts (Confirmée, En attente, Annulée).
    *   Historique complet des séjours passés.
    *   Téléchargement des factures.
*   **Favoris**: Sauvegarde des hôtels préférés.
*   **Avis**: Possibilité de noter et commenter les séjours après check-out.
*   **Messagerie Instantanée**: Chat en direct avec les propriétaires d'hôtels pour poser des questions avant/pendant le séjour.

### 3️⃣ Espace Propriétaire (Owner)
*   **Dashboard Financier**: Graphiques des revenus mensuels et taux d'occupation.
*   **Gestion Hôtelière**:
    *   Ajout/Modification des informations de l'hôtel.
    *   CRUD complet des chambres (Photos, Tarifs, Disponibilités).
*   **Gestion des Réservations**:
    *   Validation ou refus des demandes.
    *   Vue Calendrier pour gérer les disponibilités.
*   **Réponse aux Avis**: Droit de réponse officiel aux commentaires clients.
*   **Messagerie**: Gestion centralisée des conversations avec les futurs clients.

### 4️⃣ Espace Administrateur (Admin)
*   **Vue Globale**: Analytics sur l'ensemble de la plateforme (Nombre d'utilisateurs, Volume de réservations, Chiffre d'affaires global).
*   **Gestion Utilisateurs**:
    *   Liste de tous les utilisateurs (Clients & Owners).
    *   Invitation de nouveaux propriétaires.
*   **Audit Logs**: Traçabilité complète des actions sensibles (suppressions, modifications de droits).
*   **Promotions**: Création de codes promo globaux (ex: `SUMMER2026`).
*   **Configuration**: Paramètres système globaux.

## 🔑 Comptes de Test (Mock Data)
L'application utilise des données simulées (`mockData.ts`) pour permettre de tester toutes les fonctionnalités sans backend actif.

| Rôle | Email | Mot de passe |
| :--- | :--- | :--- |
| **Administrateur** | `admin@luxotel.com` | `admin` |
| **Propriétaire** | `owner@hotel.com` | `owner` |
| **Client** | `client@user.com` | `user` |

## 🛠️ Installation et Démarrage

### Prérequis
- Node.js (v18+)

### Installation
```bash
cd HotelBookingSystem
npm install
# ou
bun install
```

### Lancement
```bash
npm run dev
# ou
bun run dev
```
L'application sera accessible sur `http://localhost:5173`.

## 📝 Notes Techniques
- **Mock Data**: Le backend réel peut être remplacé par les données mockées pour le développement frontend isolé.
- **Sécurité**: Les routes `/admin`, `/owner` et `/profile` sont protégées par le composant `ProtectedRoute` qui vérifie le rôle de l'utilisateur connecté via `AuthContext`.
- **Performance**: Utilisation de `React.lazy` et `Suspense` pour le chargement optimisé des pages.
