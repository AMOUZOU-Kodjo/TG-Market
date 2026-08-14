# Cahier API — Développeur Mobile

> Contrat API pour l'application mobile TG-Market (AK Market).
> Base URL : `https://tg-market-api-production.up.railway.app/api`
> Socket : `wss://tg-market-api-production.up.railway.app` (Socket.IO v4)

---

## 1. Authentification

- **JWT Bearer** : header `Authorization: Bearer <accessToken>` sur toutes les routes protégées (✓).
- Login : `POST /auth/login` `{ email, password }` → `{ accessToken, refreshToken, user }` (accès 24h, refresh 30j).
- Refresh : `POST /auth/refresh` avec `refreshToken` (body ou cookie).
- Socket : `io(url, { auth: { token: accessToken } })` — sans token → `connect_error: "Authentication error"`.
- **Remarque** : sans « se souvenir de moi », le token est stocké côté client ; le socket doit se reconnecter après chaque login et après un refresh de token.

---

## 2. Objet Escrow (structure retournée partout)

`GET /escrow`, `GET /escrow/:id` et toutes les mutations retournent cet objet :

```jsonc
{
  "id": 12,                       // number
  "productId": 34,                // number | null
  "bundleId": null,               // number | null (lot acheté)
  "buyerId": 8,
  "sellerId": 15,
  "buyerName": "Jean Kouassi",
  "sellerName": "Ama Mensah",
  "productTitle": "iPhone 12",
  "productImage": "https://res.cloudinary.com/.../img.jpg",
  "bundleTitle": null,
  "amount": 250000,               // FCFA, montant produit
  "fee": 2500,                    // frais plateforme (prélevés sur le vendeur)
  "buyerFee": 1250,               // frais d'achat payé par l'acheteur
  "status": "paid",               // voir §3
  "paymentMethod": "flooz",       // string | null
  "confirmationToken": "uuid",    // payload du QR (voir §6)
  "payout": null,                 // objet payout | null (voir §7)
  "createdAt": "2026-08-14T10:00:00.000Z",
  "confirmedAt": null,            // date paiement confirmé | null
  "releasedAt": null,             // date fonds libérés | null
  "disputedBy": null              // id de l'auteur du litige | null — NOUVEAU
}
```

## 3. Statuts escrow

| Status | Signification |
|---|---|
| `pending` | En attente de paiement |
| `awaiting_verification` | Paiement manuel en cours de vérification |
| `paid` | Paiement confirmé, vendeur doit expédier |
| `pending_delivery` | Expédiée, acheteur doit confirmer la réception |
| `delivered` | Livrée — confirmation par code requise |
| `disputed` | Litige en cours |
| `completed` | Terminée, fonds libérés au vendeur |
| `cancelled` | Annulée |
| `refunded` | Remboursée |

---

## 4. Cycle de vie de la commande (séquentiel)

| # | Étape | Endpoint | Rôle | Résultat |
|---|---|---|---|---|
| 1 | Créer | `POST /escrow` `{ productId, sellerId, paymentMethod }` | Acheteur | statut `pending` |
| 2 | Payer | `POST /escrow/:id/confirm-payment` (ou `POST /payments/initiate` Flutterwave) | Acheteur | `awaiting_verification` ou `paid` |
| 3 | Expédier | `PUT /escrow/:id/mark-shipped` | Vendeur | `pending_delivery` |
| 4 | Confirmer réception | `PUT /escrow/:id/confirm-delivery` | Acheteur | `delivered` + code 4 chiffres généré |
| 5 | Saisir le code | `PUT /escrow/:id/confirm-code` `{ code }` | Vendeur | `completed`, payout au vendeur |

> L'acheteur peut aussi scanner le QR du vendeur : `POST /escrow/scan-confirm` `{ token }` → `{ confirmationCode }` (code à 4 chiffres à communiquer au vendeur).

---

## 5. Litiges — endpoints (NOUVEAUX/COMPLÉTÉS)

### 5.1 Ouvrir un litige
`PUT /escrow/:id/dispute` — Auth ✓ — Acheteur **ou** vendeur
```json
{ "reason": "Produit non conforme (min. 10 caractères)" }
```
- → `200` objet escrow avec `status: "disputed"`, `disputedBy: <id auteur>`
- Interdit si `completed` / `cancelled` / `refunded` → `400`
- Non participant → `403`

### 5.2 Refermer son litige (reprendre la vente) — NOUVEAU
`PUT /escrow/:id/cancel-dispute` — Auth ✓ — **Seul l'auteur du litige**
- Body : aucun
- → `200` escrow avec `status` restauré (`paid`, `pending_delivery` ou `delivered`), `disputedBy: null`
- Erreurs :
  - `404` « Transaction introuvable »
  - `403` « Seul l'auteur du litige peut le refermer »
  - `400` « Ce litige a déjà été traité » (statut ≠ `disputed`)
  - `400` « Ce litige ne peut pas être repris automatiquement, contactez l'administrateur » (litige ancien, pré-migration)

### 5.3 Résolution par l'admin
`PUT /admin/escrow/:id/resolve` — Auth admin ✓
```json
{ "action": "refund" }        // remboursement acheteur → refunded
{ "action": "complete" }      // payout vendeur → completed
```
- `400` si action invalide ou transaction non `disputed`

### 5.4 Reprise par l'admin — NOUVEAU
`PUT /admin/escrow/:id/resume` — Auth admin ✓
- Body : aucun — même comportement que §5.2 (statut restauré)
- Notifie acheteur + vendeur

### 5.5 Annuler la commande
`PUT /escrow/:id/cancel` — Auth ✓ — `400` si déjà traitée

---

## 6. QR code & code de confirmation

- Le QR encode `confirmationToken` (UUID de l'escrow, exposé dans l'objet escrow).
- `POST /escrow/scan-confirm` `{ token }` (Auth ✓, réservé à l'acheteur) → `{ confirmationCode }` (4 chiffres).
- `PUT /escrow/:id/confirm-code` `{ code }` (Auth ✓, réservé au vendeur) :
  - 5 tentatives max (compteur Redis 1h) puis code invalidé → le vendeur doit recontacter l'acheteur.
  - `400` « Code invalide » sur erreur.
- Payout vendeur automatique à la confirmation (montant − frais). Badge `first_sale` accordé à la première vente complétée.

---

## 7. Payout (vue vendeur)

`escrow.payout` (quand présent) :
```jsonc
{
  "id": 5,
  "amount": 247500,        // net vendeur
  "status": "pending",     // pending | paid | failed | retrying
  "method": "flooz",       // flooz | tmoney | bank | flutterwave
  "errorMessage": null,
  "createdAt": "..."
}
```

---

## 8. Événements Socket.IO à écouter

| Événement | Payload | Quand |
|---|---|---|
| `escrow_updated` | `{ escrow }` | Tout changement de statut (paiement, expédition, litige, reprise, résolution) → refetch `GET /escrow/:id` |
| `escrow_created` | `{ escrow }` | Nouvelle commande |
| `new_message` | `{ conversationId, message }` | Message reçu dans une conversation (room `conversation:<id>`) |
| `message_notification` | `{ conversationId }` | Message reçu hors conversation ouverte (badge) |
| `notification` | `{ id, type, title, description, productId, read, createdAt, metadata }` | Notification temps réel |
| `user_online` / `user_offline` | `{ userId }` | Statut présence |
| `user_typing` / `user_stop_typing` | `{ conversationId, userId }` | Indicateur de saisie |
| `wallet_updated` | — | Solde changé (remboursement, payout) → refetch wallet |

Événements client : `join_room`/`leave_room` (`{ room: "conversation:<id>" }`), `send_message` (`{ conversationId, content, type?, metadata? }`), `typing_start`/`typing_stop`, `notification_read`.

## 9. Types de notifications (champ `type`)

| Type | Signification |
|---|---|
| `payment_confirmed` | Paiement confirmé (vendeur) |
| `delivery_confirmed` | Livraison confirmée |
| `escrow_disputed` | Litige ouvert sur une commande |
| `escrow_dispute_cancelled` | Litige refermé, vente reprise — NOUVEAU |
| `dispute_resolved` | Litige tranché par l'admin (refund ou complete) |
| `escrow_cancelled` | Commande annulée |
| `message` | Nouveau message |

## 10. Erreurs — format standard

```json
{ "error": "message lisible", "errors": { "body": ["détail validation"] } }
```
- `400` requête invalide / action impossible · `401` token manquant/invalide · `403` non autorisé · `404` introuvable · `422` validation Zod (avec `errors.body`).

---

## 11. Endpoints admin (rôle admin uniquement)

| Méthode | Path | Description |
|---|---|---|
| GET | `/admin/escrow` | Liste paginée (inclut `paymentRef` pour vérifier les paiements manuels) |
| PUT | `/admin/escrow/:id/verify` | Vérifier paiement manuel |
| PUT | `/admin/escrow/:id/resolve` | `{ action: "refund" \| "complete" }` |
| PUT | `/admin/escrow/:id/resume` | Reprendre la vente — NOUVEAU |
| PUT | `/admin/products/:id/status` | Statut produit — `400` si `sold → active` (produit vendu) |

## 12. Liens utiles

- Frontend web : `https://ak-market.pages.dev`
- Health check : `GET /health`
- Test socket : connexion avec token puis `join_room` sur `conversation:<id>`