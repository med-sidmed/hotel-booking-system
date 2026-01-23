# Luxotel - Hotel Booking System (Backend)

## 📌 Présentation

Luxotel est une API RESTful robuste pour un système de réservation d'hôtels de luxe. Elle gère trois types d'utilisateurs : **Clients**, **Propriétaires d'hôtels** (Owners) et **Administrateurs**, avec un système complet de gestion des accès basé sur les rôles (RBAC).

Ce backend a été conçu pour supporter une application Frontend React moderne, offrant des fonctionnalités temps-réel (messagerie), de fidélité et de gestion avancée.

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
| **USER**  | Réserver, laisser des avis, consulter ses points fidélité, chat avec propriétaires |
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

### 7. Fidélité & Promotions (`/api/loyalty`, `/api/promotions`)

| Méthode | Endpoint | Description | Auth Requise |
| :--- | :--- | :--- | :--- |
| `GET` | `/loyalty/status/` | Voir points et statut (Gold/Silver) | Client |
| `GET` | `/loyalty/history/` | Historique des points gagnés/utilisés | Client |
| `GET` | `/promotions/` | Voir les promos actives | Tout le monde |
| `POST` | `/promotions/validate/` | Vérifier un code promo | Client |
| `POST` | `/promotions/` | Créer une promotion | Admin |

### 8. Administration & Logs (`/api/admin`)

| Méthode | Endpoint | Description | Auth Requise |
| :--- | :--- | :--- | :--- |
| `GET` | `/admin/stats/` | Dashboard (Revenus, Réservations, Nouveaux users) | Admin |
| `GET` | `/admin/users/` | Gestion des utilisateurs | Admin |
| `GET` | `/admin/audit-logs/` | Logs d'activité système | Admin |
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

### `LoyaltyPoints`
Portefeuille de points par utilisateur. Permet de monter en grade (Tier upgrade).

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
