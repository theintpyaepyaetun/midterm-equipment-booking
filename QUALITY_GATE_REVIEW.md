# Quality Gate Review

## Finding 1 — Reliability / Accuracy

### What I found

The API checks that `startAt` is before `endAt`. The current implementation compares the timestamp values as strings, so the API expects timestamps to use the consistent ISO 8601 format used by the API contract.

### How I fixed it

I verified that the API uses the expected ISO 8601 timestamp format and tested an invalid time range to confirm that invalid booking times are rejected.

### Evidence

The invalid time test returned:

HTTP/1.1 400 Bad Request

{
  "error": "startAt must be before endAt"
}

---

## Finding 2 — Validation

### What I found

A booking must use an equipment ID that exists in the equipment table.

### How I fixed it

The API checks the equipment table before creating or updating a booking.

### Evidence

Testing with `equipmentId: "eq-999"` returned:

HTTP/1.1 400 Bad Request

{
  "error": "Equipment not found"
}

---

## Finding 3 — Reasoning / You Own It

### What I found

Two bookings for the same equipment must not overlap.

### How I fixed it

I implemented an overlap check using:

startAt < existing endAt

AND

endAt > existing startAt

The SQL query uses parameter binding.

### Evidence

A second booking for `eq-1` during an existing booking period returned:

HTTP/1.1 409 Conflict

{
  "error": "Booking time overlaps with an existing booking"
}

---

## Final Verification

I tested the API using cURL and verified:

- GET `/equipment` — 200 OK
- GET `/bookings` — 200 OK
- POST `/bookings` — 201 Created
- GET `/bookings/:id` — 200 OK
- PATCH `/bookings/:id` — 200 OK
- DELETE `/bookings/:id` — 204 No Content
- Invalid equipment — 400 Bad Request
- Invalid time — 400 Bad Request
- Booking not found — 404 Not Found
- Overlapping booking — 409 Conflict