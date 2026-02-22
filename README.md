# Luxotel - Hotel Booking System (Backend)

## 📌 Présentation

Luxotel est une API RESTful robuste pour un système de réservation d'hôtels de luxe. Elle gère trois types d'utilisateurs : **Clients**, **Propriétaires d'hôtels** (Owners) et **Administrateurs**, avec un système complet de gestion des accès basé sur les rôles (RBAC).

Ce backend a été conçu pour supporter une application Frontend React moderne, offrant des fonctionnalités temps-réel (messagerie) et de gestion avancée.

## 🚀 Technologies Utilisées

- **Core**: Python 3.11+, Django 5.x
- **Package Manager**: uv (gestionnaire de paquets Python ultra-rapide)
- **Base de données**: PostgreSQL (production) / SQLite (développement)
- **API**: Django REST Framework
- **Authentification**: JWT (JSON Web Tokens)
- **Documentation**: Swagger / OpenAPI

## 🛠️ Installation et Démarrage

### Prérequis
- Python 3.11+
- uv (gestionnaire de paquets)

### Installation et Lancement

```bash
# 1. Installer les dépendances
make django (ou `uv sync`)

# 2. Appliquer les migrations
make migration

# 3. Créer un superutilisateur
make superuser

# 4. Lancer le serveur
make run
```

L'API sera accessible sur `http://localhost:8000`.

## � Architecture et Sécurité

### Système RBAC (Role-Based Access Control)

| Rôle      | Permissions                                                  |
| --------- | ------------------------------------------------------------ |
| **USER**  | Réserver, laisser des avis, chat avec propriétaires |
| **OWNER** | Gérer ses hôtels/chambres, voir le planning, répondre aux avis, stats financières |
| **ADMIN** | Accès complet : gestion utilisateurs, validation hôtels, logs d'audit, config système |

## 📡 Documentation des Endpoints API

### 1. Authentification (`/api/auth`)

| Méthode | Endpoint | Description | Auth Requise |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register/` | Création d'un nouveau compte (Client/Owner) | Non |
| `POST` | `/auth/login/` | Connexion (Retourne Access & Refresh Tokens) | Non |
| `POST` | `/auth/refresh/` | Rafraîchir le token d'accès | Non |
| `POST` | `/auth/logout/` | Déconnexion (Blacklist token) | Oui |
| `GET` | `/auth/me/` | Récupérer le profil de l'utilisateur connecté | Oui |
| `PUT` | `/auth/profile/` | Mettre à jour le profil (Avatar, Préférences) | Oui |

### 2. Hôtels (`/api/hotels`)

| Méthode | Endpoint | Description | Auth Requise |
| :--- | :--- | :--- | :--- |
| `GET` | `/hotels/` | Lister les hôtels (Filtres: `city`, `price_min`, `price_max`, `rating`, `amenities`) | Non |
| `GET` | `/hotels/{id}/` | Détails complets d'un hôtel | Non |
| `POST` | `/hotels/` | Créer un nouvel hôtel | Owner/Admin |
| `PUT` | `/hotels/{id}/` | Modifier les informations de l'hôtel | Owner/Admin |
| `DELETE` | `/hotels/{id}/` | Supprimer un hôtel | Admin |

### 3. Chambres (`/api/rooms`)

| Méthode | Endpoint | Description | Auth Requise |
| :--- | :--- | :--- | :--- |
| `GET` | `/hotels/{id}/rooms/` | Lister les chambres d'un hôtel (Disponibilité par dates) | Non |
| `GET` | `/rooms/{id}/` | Détails d'une chambre | Non |
| `POST` | `/hotels/{id}/rooms/` | Ajouter une chambre | Owner |
| `PUT` | `/rooms/{id}/` | Modifier une chambre (Prix, Dispo) | Owner |
| `DELETE` | `/rooms/{id}/` | Supprimer une chambre | Owner |

### 4. Réservations (`/api/bookings`)

| Méthode | Endpoint | Description | Auth Requise |
| :--- | :--- | :--- | :--- |
| `GET` | `/bookings/` | Lister mes réservations (Client) ou toutes (Admin) | Oui |
| `GET` | `/bookings/owner/` | Lister les réservations de mes hôtels | Owner |
| `POST` | `/bookings/` | Créer une réservation | Client |
| `GET` | `/bookings/{id}/` | Détails d'une réservation | Oui |
| `PATCH` | `/bookings/{id}/cancel/` | Annuler une réservation | Oui |
| `PATCH` | `/bookings/{id}/status/` | Changer statut (Confirmé/Check-in/Out) | Owner/Admin |

### 5. Avis & Évaluations (`/api/reviews`)

| Méthode | Endpoint | Description | Auth Requise |
| :--- | :--- | :--- | :--- |
| `GET` | `/hotels/{id}/reviews/` | Lire les avis d'un hôtel | Non |
| `POST` | `/bookings/{id}/review/` | Laisser un avis après séjour | Client |
| `POST` | `/reviews/{id}/reply/` | Répondre à un avis | Owner |

### 6. Messagerie / Chat (`/api/messages`)

| Méthode | Endpoint | Description | Auth Requise |
| :--- | :--- | :--- | :--- |
| `GET` | `/conversations/` | Lister mes conversations | Oui |
| `GET` | `/conversations/{id}/` | Voir les messages d'une conversation | Oui |
| `POST` | `/conversations/` | Démarrer une conversation (Client -> Owner) | Client |
| `POST` | `/messages/` | Envoyer un message | Oui |
| `PATCH` | `/messages/{id}/read/` | Marquer comme lu | Oui |

### 7. Promotions (`/api/promotions`)

| Méthode | Endpoint | Description | Auth Requise |
| :--- | :--- | :--- | :--- |
| `GET` | `/promotions/` | Voir les promos actives | Tout le monde |
| `POST` | `/promotions/validate/` | Vérifier un code promo | Client |
| `POST` | `/promotions/` | Créer une promotion | Admin |

### 8. Administration & Logs (`/api/admin`)

| Méthode | Endpoint | Description | Auth Requise |
| :--- | :--- | :--- | :--- |
| `GET` | `/admin/stats/` | Dashboard (Revenus, Réservations, Nouveaux users) | Admin |
| `GET` | `/admin/users/` | Gestion des utilisateurs | Admin |
| `POST` | `/admin/invitations/` | Générer un lien d'invitation (Owner/Admin) | Admin |

### 9. Propriétaires (`/api/owner`)

| Méthode | Endpoint | Description | Auth Requise |
| :--- | :--- | :--- | :--- |
| `GET` | `/owner/stats/` | Dashboard financier et occupation | Owner |
| `GET` | `/owner/calendar/` | Vue calendrier des réservations | Owner |

---

## 📂 Structure des Données (Models)

### `User`
Utilisateur étendu avec rôle, avatar, préférences (devise/langue).

### `Hotel` & `Room`
Entités principales. `Hotel` contient localisation, équipements, moyenne des notes. `Room` contient capacité, prix, type.

### `Booking`
Lien entre `User` et `Room`. Statuts: `PENDING`, `CONFIRMED`, `CHECKED_IN`, `COMPLETED`, `CANCELLED`.

### `Conversation` & `Message`
Système de chat temps réel. Une conversation lie un Client et un Owner (via l'Hôtel).

### `Review`
Note (1-5), commentaire, photos, et réponse du propriétaire.

### `AuditLog`
Trace toutes les actions sensibles (Crée par Admin, Modif Prix, Annulation forcée).

---

## 🔧 Variables d'Environnement (.env)

Créez un fichier `.env` à la racine :

```ini
DEBUG=True
SECRET_KEY=votre_cle_secrete_ici
DATABASE_URL=postgres://user:password@localhost:5432/luxotel_db
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

## 📚 Documentation Interactive

Une fois le serveur lancé :
- **Swagger UI**: `http://localhost:8000/api/docs/`
- **ReDoc**: `http://localhost:8000/api/redoc/`
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
```mermaid
classDiagram
   class User {
       +UUID id
       +String email
       +String name
       +String password
       +UserRole role
       +String phone
       +String address
       +String avatar
       +Date dateOfBirth
       +JSON preferences
       +Boolean isActive
       +DateTime createdAt
       +DateTime updatedAt
       +login()
       +logout()
       +updateProfile()
       +resetPassword()
   }

   class Hotel {
       +UUID id
       +String name
       +String location
       +String description
       +Float rating
       +Integer reviewsCount
       +String[] images
       +Decimal pricePerNight
       +String[] amenities
       +String phone
       +String email
       +String website
       +UUID ownerId
       +DateTime createdAt
       +DateTime updatedAt
       +updateInfo()
       +addRoom()
       +removeRoom()
   }

   class Room {
       +UUID id
       +UUID hotelId
       +String type
       +String description
       +Decimal price
       +Integer capacity
       +String[] amenities
       +String[] images
       +Boolean available
       +DateTime createdAt
       +DateTime updatedAt
       +updatePrice()
       +toggleAvailability()
       +addPricingRule()
   }

   class Booking {
       +UUID id
       +UUID userId
       +UUID roomId
       +Date checkIn
       +Date checkOut
       +Decimal totalPrice
       +BookingStatus status
       +DateTime createdAt
       +DateTime updatedAt
       +confirm()
       +cancel()
       +complete()
       +calculateTotal()
   }

   class Review {
       +UUID id
       +UUID hotelId
       +UUID userId
       +Integer rating
       +String comment
       +String[] photos
       +JSON ownerResponse
       +Boolean verified
       +DateTime createdAt
       +DateTime updatedAt
       +addResponse()
       +verify()
   }

   class Transaction {
       +UUID id
       +UUID userId
       +UUID bookingId
       +Decimal amount
       +Currency currency
       +PaymentMethod method
       +TransactionStatus status
       +PaymentType type
       +String invoiceUrl
       +DateTime createdAt
       +process()
       +refund()
       +generateInvoice()
   }

   class Notification {
       +UUID id
       +UUID userId
       +NotificationType type
       +String title
       +String message
       +Boolean read
       +String actionUrl
       +DateTime createdAt
       +markAsRead()
       +delete()
   }

   class Message {
       +UUID id
       +UUID conversationId
       +UUID senderId
       +String content
       +Boolean read
       +Boolean isDeleted
       +DateTime createdAt
       +markAsRead()
       +delete()
   }

   class Conversation {
       +UUID id
       +UUID hotelId
       +Integer unreadCount
       +DateTime createdAt
       +DateTime updatedAt
       +addParticipant()
       +removeParticipant()
       +incrementUnread()
   }

   class Promotion {
       +UUID id
       +String code
       +String title
       +String description
       +DiscountType discountType
       +Decimal discountValue
       +DateTime validFrom
       +DateTime validUntil
       +Decimal minPurchase
       +Decimal maxDiscount
       +Integer usageLimit
       +Integer usedCount
       +Boolean active
       +DateTime createdAt
       +validate()
       +apply()
       +deactivate()
   }

  

   class PricingRule {
       +UUID id
       +UUID roomId
       +SeasonType seasonType
       +Date startDate
       +Date endDate
       +Decimal priceModifier
       +Integer[] dayOfWeek
       +DateTime createdAt
       +apply()
       +isActive()
   }

   class Invitation {
       +UUID id
       +String token
       +String email
       +UserRole role
       +DateTime expiresAt
       +Boolean used
       +DateTime createdAt
       +validate()
       +markAsUsed()
   }

   %% Enumerations
   class UserRole {
       <<enumeration>>
       USER
       OWNER
       ADMIN
   }

   class BookingStatus {
       <<enumeration>>
       PENDING
       CONFIRMED
       CANCELLED
       COMPLETED
   }

   class Currency {
       <<enumeration>>
       MRU
       EUR
       USD
   }

   class PaymentMethod {
       <<enumeration>>
       CARD
       CASH
       BANK_TRANSFER
   }

   class TransactionStatus {
       <<enumeration>>
       PENDING
       COMPLETED
       FAILED
       REFUNDED
   }

   class PaymentType {
       <<enumeration>>
       DEPOSIT
       FULL_PAYMENT
   }

   class NotificationType {
       <<enumeration>>
       BOOKING_CONFIRMED
       BOOKING_CANCELLED
       PAYMENT_SUCCESS
       REVIEW_REQUEST
       MESSAGE
       PROMOTION
   }

   class DiscountType {
       <<enumeration>>
       PERCENTAGE
       FIXED
   }

   class SeasonType {
       <<enumeration>>
       LOW
       NORMAL
       HIGH
       PEAK
   }

   class ActionType {
       <<enumeration>>
       CREATE
       UPDATE
       DELETE
       LOGIN
       LOGOUT
   }

   class EntityType {
       <<enumeration>>
       USER
       BOOKING
       HOTEL
       ROOM
       REVIEW
   }

   %% Relationships
   User "1" --> "0..*" Hotel : owns
   User "1" --> "0..*" Booking : makes
   User "1" --> "0..*" Review : writes
   User "1" --> "0..*" Transaction : has
   User "1" --> "0..*" Notification : receives
   User "1" --> "0..*" Message : sends
   User "0..*" --> "0..*" Conversation : participates

   Hotel "1" --> "0..*" Room : contains
   Hotel "1" --> "0..*" Review : receives
   Hotel "0..1" --> "0..*" Conversation : related

   Room "1" --> "0..*" Booking : booked
   Room "1" --> "0..*" PricingRule : has

   Booking "1" --> "0..*" Transaction : generates
   Booking "1" --> "0..1" Promotion : uses

   Conversation "1" --> "0..*" Message : contains

   %% Enum associations
   User --> UserRole
   Booking --> BookingStatus
   Transaction --> Currency
   Transaction --> PaymentMethod
   Transaction --> TransactionStatus
   Transaction --> PaymentType
   Notification --> NotificationType
   Promotion --> DiscountType
   PricingRule --> SeasonType
   Invitation --> UserRole
```
