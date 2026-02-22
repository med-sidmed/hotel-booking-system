# Exemples Postman — API Hotels

**Base URL :** `http://localhost:8000`

**Authentification :** L’API utilise la session Django. Pour les requêtes qui nécessitent d’être connecté :
1. Connecte-toi une fois via l’admin : `http://localhost:8000/admin/` (crée un superuser avec `uv run manage.py createsuperuser` si besoin).
2. Dans Postman, pour les requêtes suivantes, va dans **Params** ou **Headers** et n’ajoute rien de spécial : en mode “Cookie” / “Send cookies”, si tu as ouvert l’admin dans le même navigateur, ça peut suffire.  
   **Ou** utilise **Authorization > Type: Basic Auth** avec ton login/mot de passe admin pour les appels qui demandent une auth.

Pour envoyer le cookie de session manuellement :
- Après login admin, ouvre les DevTools (F12) > Application > Cookies > `http://localhost:8000` et copie la valeur de `sessionid`.
- Dans Postman : **Headers** → `Cookie` : `sessionid=TA_VALUE_ICI`.

---

## 1. Hôtels

### 1.1 Liste des hôtels (public)
- **Method:** `GET`
- **URL:** `http://localhost:8000/api/hotels/`
- **Body:** aucun

### 1.2 Liste avec filtres (public)
- **Method:** `GET`
- **URL:** `http://localhost:8000/api/hotels/?city=Nouakchott&price_min=50&price_max=200&rating=4`
- **Query params (optionnels):**
  - `city` : texte (ex: Nouakchott)
  - `price_min` : nombre
  - `price_max` : nombre
  - `rating` : nombre (min. note)
  - `amenities` : liste séparée par des virgules (ex: `Wi-Fi,Piscine`)

### 1.3 Détail d’un hôtel (public)
- **Method:** `GET`
- **URL:** `http://localhost:8000/api/hotels/{{hotel_id}}/`
- Remplace `{{hotel_id}}` par un UUID (ex: celui renvoyé par la liste).

### 1.4 Créer un hôtel (auth : propriétaire ou admin)
- **Method:** `POST`
- **URL:** `http://localhost:8000/api/hotels/`
- **Headers:** `Content-Type: application/json` (+ cookie session si besoin)
- **Body (raw JSON):**
```json
{
  "name": "Hôtel Sahara",
  "location": "Nouakchott, Mauritanie",
  "description": "Un bel hôtel en centre-ville.",
  "price_per_night": "150.00",
  "amenities": ["Wi-Fi", "Piscine", "Parking"],
  "phone": "+222 40 00 00 00",
  "email": "contact@hotelsahara.mr",
  "website": "https://hotelsahara.mr"
}
```

### 1.5 Modifier un hôtel (owner/admin)
- **Method:** `PUT` ou `PATCH`
- **URL:** `http://localhost:8000/api/hotels/{{hotel_id}}/`
- **Body (exemple partiel):**
```json
{
  "name": "Hôtel Sahara & Spa",
  "price_per_night": "180.00"
}
```

### 1.6 Supprimer un hôtel (admin uniquement)
- **Method:** `DELETE`
- **URL:** `http://localhost:8000/api/hotels/{{hotel_id}}/`

---

## 2. Chambres

### 2.1 Liste des chambres d’un hôtel (public)
- **Method:** `GET`
- **URL:** `http://localhost:8000/api/hotels/{{hotel_id}}/rooms/`

### 2.2 Ajouter une chambre (owner)
- **Method:** `POST`
- **URL:** `http://localhost:8000/api/hotels/{{hotel_id}}/rooms/`
- **Headers:** `Content-Type: application/json`
- **Body:**
```json
{
  "type": "Double Standard",
  "description": "Chambre double avec vue mer",
  "price": "120.00",
  "capacity": 2,
  "amenities": ["Wi-Fi", "TV", "Climatisation"],
  "images": [],
  "available": true
}
```

### 2.3 Détail d’une chambre (public)
- **Method:** `GET`
- **URL:** `http://localhost:8000/api/rooms/{{room_id}}/`

### 2.4 Modifier une chambre (owner)
- **Method:** `PUT` ou `PATCH`
- **URL:** `http://localhost:8000/api/rooms/{{room_id}}/`
- **Body (exemple):**
```json
{
  "price": "130.00",
  "available": true
}
```

### 2.5 Supprimer une chambre (owner)
- **Method:** `DELETE`
- **URL:** `http://localhost:8000/api/rooms/{{room_id}}/`

---

## 3. Réservations

### 3.1 Mes réservations (client) / Toutes (admin)
- **Method:** `GET`
- **URL:** `http://localhost:8000/api/bookings/`
- **Auth:** requise

### 3.2 Réservations de mes hôtels (owner)
- **Method:** `GET`
- **URL:** `http://localhost:8000/api/bookings/owner/`
- **Auth:** requise (compte propriétaire)

### 3.3 Créer une réservation (client)
- **Method:** `POST`
- **URL:** `http://localhost:8000/api/bookings/`
- **Headers:** `Content-Type: application/json`
- **Body:** Remplace `{{room_id}}` par l’UUID d’une chambre. `promotion` optionnel.
```json
{
  "room": "{{room_id}}",
  "check_in": "2025-03-01",
  "check_out": "2025-03-05",
  "promotion": null
}
```
Avec code promo (si tu as l’UUID d’une promotion) :
```json
{
  "room": "{{room_id}}",
  "check_in": "2025-03-01",
  "check_out": "2025-03-05",
  "promotion": "{{promotion_id}}"
}
```

### 3.4 Détail d’une réservation
- **Method:** `GET`
- **URL:** `http://localhost:8000/api/bookings/{{booking_id}}/`
- **Auth:** requise (client, owner ou admin)

### 3.5 Annuler une réservation
- **Method:** `PATCH`
- **URL:** `http://localhost:8000/api/bookings/{{booking_id}}/cancel/`
- **Body:** vide ou `{}`
- **Auth:** client concerné ou admin

### 3.6 Changer le statut (owner/admin)
- **Method:** `PATCH`
- **URL:** `http://localhost:8000/api/bookings/{{booking_id}}/status/`
- **Headers:** `Content-Type: application/json`
- **Body:**
```json
{
  "status": "CONFIRMED"
}
```
ou `"status": "COMPLETED"`.

---

## 4. Avis

### 4.1 Avis d’un hôtel (public)
- **Method:** `GET`
- **URL:** `http://localhost:8000/api/hotels/{{hotel_id}}/reviews/`

### 4.2 Déposer un avis après séjour (client)
- **Method:** `POST`
- **URL:** `http://localhost:8000/api/bookings/{{booking_id}}/review/`
- **Headers:** `Content-Type: application/json`
- **Body:** La réservation doit être en statut `COMPLETED`.
```json
{
  "rating": 5,
  "comment": "Séjour parfait, je recommande !",
  "photos": []
}
```

### 4.3 Répondre à un avis (owner)
- **Method:** `POST`
- **URL:** `http://localhost:8000/api/reviews/{{review_id}}/reply/`
- **Headers:** `Content-Type: application/json`
- **Body:**
```json
{
  "text": "Merci pour votre avis, nous sommes ravis que votre séjour vous ait plu."
}
```

---

## 5. Promotions

### 5.1 Liste des promos actives (public)
- **Method:** `GET`
- **URL:** `http://localhost:8000/api/promotions/`

### 5.2 Créer une promotion (admin)
- **Method:** `POST`
- **URL:** `http://localhost:8000/api/promotions/`
- **Headers:** `Content-Type: application/json`
- **Body (exemple pourcentage):**
```json
{
  "code": "SUMMER2025",
  "title": "Été 2025",
  "description": "-20% sur votre séjour",
  "discount_type": "PERCENTAGE",
  "discount_value": "20.00",
  "valid_from": "2025-06-01T00:00:00Z",
  "valid_until": "2025-08-31T23:59:59Z",
  "min_purchase": "100.00",
  "max_discount": "50.00",
  "usage_limit": 100,
  "active": true
}
```
**Montant fixe :**
```json
{
  "code": "WELCOME10",
  "title": "Bienvenue",
  "discount_type": "FIXED",
  "discount_value": "10.00",
  "valid_from": "2025-01-01T00:00:00Z",
  "valid_until": "2025-12-31T23:59:59Z",
  "min_purchase": "50.00",
  "active": true
}
```

### 5.3 Valider un code promo (client connecté)
- **Method:** `POST`
- **URL:** `http://localhost:8000/api/promotions/validate/`
- **Headers:** `Content-Type: application/json`
- **Body:**
```json
{
  "code": "SUMMER2025",
  "amount": "150.00"
}
```
Réponse attendue (ex.) : `{"valid": true, "promotion_id": "...", "code": "SUMMER2025", "discount": 30.0, "discount_type": "PERCENTAGE"}`.

---

## Ordre conseillé pour tester

1. Démarrer le serveur : `uv run manage.py runserver`
2. Créer un superuser : `uv run manage.py createsuperuser`
3. **Sans auth :** GET `/api/hotels/`, GET `/api/hotels/{{id}}/`, GET `/api/hotels/{{id}}/rooms/`, GET `/api/promotions/`
4. Se connecter à l’admin dans le navigateur pour obtenir un cookie `sessionid` (ou utiliser Basic Auth si configuré)
5. **Avec auth :** POST `/api/hotels/` pour créer un hôtel, puis POST `/api/hotels/{{id}}/rooms/` pour une chambre
6. POST `/api/bookings/` avec les `room`, `check_in`, `check_out`
7. PATCH `/api/bookings/{{id}}/status/` avec `"status": "CONFIRMED"` puis `"COMPLETED"`
8. POST `/api/bookings/{{id}}/review/` pour un avis, puis POST `/api/reviews/{{id}}/reply/` en tant qu’owner
