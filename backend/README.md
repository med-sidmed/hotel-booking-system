# Luxotel - Hotel Booking System (Backend)

## 📌 Présentation

Luxotel est une API RESTful robuste pour un système de réservation d'hôtels de luxe. Elle gère trois types d'utilisateurs : **Clients**, **Propriétaires d'hôtels** (Owners) et **Administrateurs**, avec un système complet de gestion des accès basé sur les rôles (RBAC).

Le backend met l'accent sur la sécurité, la scalabilité et une architecture maintenable suivant les meilleures pratiques Django.

## 🚀 Technologies Utilisées

- **Core**: Python 3.11+, Django 5.x
- **Package Manager**: uv (gestionnaire de paquets Python ultra-rapide)
- **Base de données**: PostgreSQL (production) / SQLite (développement)
- **API**: Django REST Framework
- **Authentification**: JWT (JSON Web Tokens)
- **Documentation**: Swagger

## 🛠️ Installation et Démarrage

### Prérequis

- Python 3.11+
- uv (gestionnaire de paquets)

### Installation de uv

```bash
pip install uv
```

### Configuration du Projet

```bash


# Installer Django et les dépendances
uv add django
# ou
make django

# Créer les migrations
uv run manage.py makemigrations && uv run manage.py migrate
# ou
make migration

# Créer un superutilisateur
make superuser

# Lancer le serveur de développement
uv run manage.py runserver
# ou
make run
```

L'API sera accessible sur `http://localhost:8000`.

## 📂 Structure de la Base de Données

### Modèles Principaux

#### **Hotel**

```python
{
    id: UUID,
    name: str,
    location: str,
    description: str,
    rating: float,
    reviews_count: int,
    images: List[str],
    price_per_night: Decimal,
    amenities: List[str],
    phone: str,
    email: str,
    website: str (optional),
    owner: ForeignKey(User),
    created_at: DateTime,
    updated_at: DateTime
}
```

#### **Room**

```python
{
    id: UUID,
    hotel: ForeignKey(Hotel),
    type: str,
    description: str (optional),
    price: Decimal,
    capacity: int,
    amenities: List[str],
    images: List[str],
    available: bool,
    created_at: DateTime,
    updated_at: DateTime
}
```

#### **Booking**

```python
{
    id: UUID,
    user: ForeignKey(User),
    room: ForeignKey(Room),
    check_in: Date,
    check_out: Date,
    total_price: Decimal,
    status: Enum['CONFIRMED', 'PENDING', 'CANCELLED', 'COMPLETED'],
    created_at: DateTime,
    updated_at: DateTime
}
```

#### **Review**

```python
{
    id: UUID,
    hotel: ForeignKey(Hotel),
    user: ForeignKey(User),
    rating: int (1-5),
    comment: str,
    photos: List[str],
    owner_response: JSONField (optional),
    verified: bool,
    created_at: DateTime,
    updated_at: DateTime
}
```

#### **Transaction**

```python
{
    id: UUID,
    user: ForeignKey(User),
    booking: ForeignKey(Booking),
    amount: Decimal,
    currency: Enum['MRU', 'EUR', 'USD'],
    method: Enum['CARD', 'CASH', 'BANK_TRANSFER'],
    status: Enum['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'],
    type: Enum['DEPOSIT', 'FULL_PAYMENT'],
    invoice_url: str (optional),
    created_at: DateTime
}
```

#### **Notification**

```python
{
    id: UUID,
    user: ForeignKey(User),
    type: Enum['BOOKING_CONFIRMED', 'BOOKING_CANCELLED', 'PAYMENT_SUCCESS',
               'REVIEW_REQUEST', 'MESSAGE', 'PROMOTION'],
    title: str,
    message: str,
    read: bool,
    action_url: str (optional),
    created_at: DateTime
}
```

#### **Message**

```python
{
    id: UUID,
    conversation: ForeignKey(Conversation),
    sender: ForeignKey(User),
    content: str,
    read: bool,
    is_deleted: bool,
    created_at: DateTime
}
```

#### **Conversation**

```python
{
    id: UUID,
    participants: ManyToManyField(User),
    hotel: ForeignKey(Hotel, optional),
    unread_count: int,
    created_at: DateTime,
    updated_at: DateTime
}
```

#### **Promotion**

```python
{
    id: UUID,
    code: str (unique),
    title: str,
    description: str,
    discount_type: Enum['PERCENTAGE', 'FIXED'],
    discount_value: Decimal,
    valid_from: DateTime,
    valid_until: DateTime,
    min_purchase: Decimal (optional),
    max_discount: Decimal (optional),
    usage_limit: int (optional),
    used_count: int,
    active: bool,
    created_at: DateTime
}
```

#### **LoyaltyPoints** 

```python
{
    user: OneToOneField(User),
    total_points: int,
    tier: Enum['BRONZE', 'SILVER', 'GOLD', 'PLATINUM'],
    created_at: DateTime,
    updated_at: DateTime
}
```

#### **LoyaltyTransaction**

```python
{
    id: UUID,
    loyalty_points: ForeignKey(LoyaltyPoints),
    points: int,
    reason: str,
    created_at: DateTime
}
```

#### **ActivityLog**

```python
{
    id: UUID,
    user: ForeignKey(User),
    action: Enum['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT'],
    entity: Enum['USER', 'BOOKING', 'HOTEL', 'ROOM', 'REVIEW'],
    entity_id: UUID,
    details: str,
    ip_address: str (optional),
    created_at: DateTime
}
```

#### **PricingRule**

```python
{
    id: UUID,
    room: ForeignKey(Room),
    season_type: Enum['LOW', 'NORMAL', 'HIGH', 'PEAK'],
    start_date: Date,
    end_date: Date,
    price_modifier: Decimal,  # Multiplicateur (ex: 1.5 = +50%)
     created_at: DateTime
}
```

#### **Invitation**

```python
{
    id: UUID,
    token: str (unique),
    email: str (optional),
    role: Enum['ADMIN', 'OWNER'],
    expires_at: DateTime,
    used: bool,
    created_at: DateTime
}
```

### Modèle Utilisateur Étendu

#### **User**

```python
{
    id: UUID,
    email: str (unique),
    name: str,
    role: Enum['USER', 'ADMIN', 'OWNER'],
    phone: str (optional),
    address: str (optional),
    avatar: str (optional),
    date_of_birth: Date (optional),
    preferences: JSONField {
        language: Enum['fr', 'en', 'ar'],
        currency: Enum['MRU', 'EUR', 'USD'],
        notifications: bool
    },
    is_active: bool,
    created_at: DateTime,
    updated_at: DateTime
}
```

## 🔐 Authentification et Autorisation

### Endpoints d'authentification

```
POST /api/auth/register/     # Inscription
POST /api/auth/login/        # Connexion (retourne JWT)
POST /api/auth/refresh/      # Rafraîchir le token
POST /api/auth/logout/       # Déconnexion
POST /api/auth/password/reset/  # Réinitialisation mot de passe
```

### Système RBAC (Role-Based Access Control)

| Rôle      | Permissions                                                  |
| --------- | ------------------------------------------------------------ |
| **USER**  | Réserver des chambres, laisser des avis, gérer son profil    |
| **OWNER** | Gérer son/ses hôtel(s), chambres, tarifs, répondre aux avis  |
| **ADMIN** | Accès complet : gestion utilisateurs, hôtels, système global |

## 📡 Endpoints API Principaux

### Hôtels

```
GET    /api/hotels/              # Liste des hôtels (avec filtres)
GET    /api/hotels/{id}/         # Détails d'un hôtel
POST   /api/hotels/              # Créer un hôtel (OWNER/ADMIN)
PUT    /api/hotels/{id}/         # Modifier un hôtel (OWNER/ADMIN)
DELETE /api/hotels/{id}/         # Supprimer un hôtel (ADMIN)
```

### Chambres

```
GET    /api/rooms/               # Liste des chambres
GET    /api/rooms/{id}/          # Détails d'une chambre
POST   /api/rooms/               # Créer une chambre (OWNER/ADMIN)
PUT    /api/rooms/{id}/          # Modifier une chambre (OWNER/ADMIN)
DELETE /api/rooms/{id}/          # Supprimer une chambre (OWNER/ADMIN)
```

### Réservations

```
GET    /api/bookings/            # Mes réservations
POST   /api/bookings/            # Créer une réservation
GET    /api/bookings/{id}/       # Détails d'une réservation
PUT    /api/bookings/{id}/       # Modifier/Annuler une réservation
```

### Avis

```
GET    /api/reviews/             # Liste des avis
POST   /api/reviews/             # Créer un avis
PUT    /api/reviews/{id}/        # Modifier un avis
POST   /api/reviews/{id}/response/ # Répondre à un avis (OWNER)
```

### Administration

```
GET    /api/admin/users/         # Gestion des utilisateurs
GET    /api/admin/analytics/     # Statistiques globales
POST   /api/admin/invitations/   # Inviter un Owner/Admin
```

## 🔧 Commandes Make Disponibles

```bash
make django       # Installer Django avec uv
make run          # Lancer le serveur de développement
make migration    # Créer et appliquer les migrations
make superuser    # Créer un superutilisateur
make test         # Lancer les tests
make lint         # Vérifier le code (flake8/black)
make shell        # Ouvrir le shell Django
```

## 🧪 Tests

```bash
# Lancer tous les tests
make test

# Tests avec couverture
uv run pytest --cov=.

# Tests d'un module spécifique
uv run pytest apps/hotels/tests/
```

## 🔑 Comptes de Test

Pour tester l'API, créez ces utilisateurs avec `make superuser` ou via l'endpoint `/api/auth/register/` :

| Rôle       | Email               | Mot de passe |
| ---------- | ------------------- | ------------ |
| **Admin**  | `admin@luxotel.com` | `admin123`   |
| **Owner**  | `owner@hotel.com`   | `owner123`   |
| **Client** | `client@user.com`   | `user123`    |

## 📚 Documentation API

Une fois le serveur lancé, accédez à la documentation interactive :

- **Swagger UI**: `http://localhost:8000/api/docs/`
- **ReDoc**: `http://localhost:8000/api/redoc/`
