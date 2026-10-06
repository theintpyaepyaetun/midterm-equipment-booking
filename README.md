# Campus Equipment Booking API

A REST API for booking shared campus equipment such as projectors and cameras.

## Technology

- TypeScript
- Hono
- Cloudflare Workers
- Cloudflare D1 / SQLite
- cURL for API testing

## Run the Project

Install dependencies:

npm install

Start the development server:

npm run dev

The local API is available at:

http://127.0.0.1:8789

## Database

The database contains two tables.

### equipment

| Column | Type | Constraint |
|---|---|---|
| id | TEXT | PRIMARY KEY |
| name | TEXT | NOT NULL |

### bookings

| Column | Type | Constraint |
|---|---|---|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT |
| equipmentId | TEXT | NOT NULL, FOREIGN KEY |
| borrowerName | TEXT | NOT NULL |
| startAt | TEXT | NOT NULL |
| endAt | TEXT | NOT NULL |
| purpose | TEXT | NOT NULL |

Relationship:

equipment (1) ---- (many) bookings

Each booking belongs to one equipment item through `equipmentId`.

Two equipment records are included:

- eq-1 — Projector
- eq-2 — Camera

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | /equipment | Get all equipment |
| GET | /bookings | Get all bookings |
| GET | /bookings/:id | Get one booking |
| POST | /bookings | Create a booking |
| PATCH | /bookings/:id | Update a booking |
| DELETE | /bookings/:id | Delete a booking |

## Validation

The API checks that:

1. The equipment exists.
2. startAt is before endAt.
3. Bookings for the same equipment cannot overlap.
4. SQL queries use parameter binding.
5. Errors are returned as JSON.

## Test Evidence

Base API URL used for testing:

http://127.0.0.1:8789

The API was tested using cURL.

Tested cases include:

- GET /equipment — 200 OK
- GET /bookings — 200 OK
- Create booking — 201 Created
- Get booking — 200 OK
- Update booking — 200 OK
- Delete booking — 204 No Content
- Invalid equipment — 400 Bad Request
- Invalid time — 400 Bad Request
- Booking not found — 404 Not Found
- Overlapping booking — 409 Conflict

Test evidence screenshots are provided with the submission.

## API Contract

See `API_CONTRACT.md` for the detailed API contract.