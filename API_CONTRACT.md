# API Contract

## Base URL

http://127.0.0.1:8789

## Equipment

### GET /equipment

Returns all available equipment.

Response: 200 OK

Example:

[
  {
    "id": "eq-1",
    "name": "Projector"
  },
  {
    "id": "eq-2",
    "name": "Camera"
  }
]

---

## Bookings

### GET /bookings

Returns all bookings.

Response: 200 OK

---

### GET /bookings/:id

Returns one booking by ID.

Response:
- 200 OK — booking found
- 404 Not Found — booking does not exist

---

### POST /bookings

Creates a new booking.

Request body:

{
  "equipmentId": "eq-1",
  "borrowerName": "Somchai Jaidee",
  "startAt": "2026-10-20T09:00:00.000Z",
  "endAt": "2026-10-20T11:00:00.000Z",
  "purpose": "Class presentation"
}

Responses:
- 201 Created — booking created
- 400 Bad Request — invalid data or equipment does not exist
- 409 Conflict — booking time overlaps with an existing booking

---

### PATCH /bookings/:id

Updates an existing booking.

Request body:

{
  "equipmentId": "eq-1",
  "borrowerName": "Somchai Jaidee",
  "startAt": "2026-10-20T09:00:00.000Z",
  "endAt": "2026-10-20T12:00:00.000Z",
  "purpose": "Updated class presentation"
}

Responses:
- 200 OK — booking updated
- 400 Bad Request — invalid data or equipment does not exist
- 404 Not Found — booking does not exist
- 409 Conflict — booking time overlaps with another booking

---

### DELETE /bookings/:id

Deletes a booking.

Responses:
- 204 No Content — booking deleted
- 404 Not Found — booking does not exist

---

## Booking Validation Rules

1. equipmentId must refer to an existing equipment record.
2. startAt must be before endAt.
3. Two bookings for the same equipment cannot overlap.
4. Database queries use parameter binding.
5. Errors are returned as JSON.

Example error:

{
  "error": "Equipment not found"
}
