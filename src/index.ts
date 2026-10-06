import { Hono } from 'hono'

type Bindings = {
  equipment_booking_db: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

app.get('/', (c) => {
  return c.json({
    message: 'Campus Equipment Booking API'
  })
})

app.get('/equipment', async (c) => {
  const { results } = await c.env.equipment_booking_db
    .prepare('SELECT * FROM equipment')
    .all()

  return c.json(results)
})
// GET all bookings
app.get('/bookings', async (c) => {
  const { results } = await c.env.equipment_booking_db
    .prepare('SELECT * FROM bookings')
    .all()

  return c.json(results)
})

// GET one booking
app.get('/bookings/:id', async (c) => {
  const id = c.req.param('id')

  const booking = await c.env.equipment_booking_db
    .prepare('SELECT * FROM bookings WHERE id = ?')
    .bind(id)
    .first()

  if (!booking) {
    return c.json({ error: 'Booking not found' }, 404)
  }

  return c.json(booking)
})
// CREATE a booking
app.post('/bookings', async (c) => {
  const body = await c.req.json()

  const {
    equipmentId,
    borrowerName,
    startAt,
    endAt,
    purpose
  } = body

  // 1. Check required fields
  if (!equipmentId || !borrowerName || !startAt || !endAt || !purpose) {
    return c.json({ error: 'All fields are required' }, 400)
  }

  // 2. Check start < end
  if (startAt >= endAt) {
    return c.json({ error: 'startAt must be before endAt' }, 400)
  }

  // 3. Check equipment exists
  const equipment = await c.env.equipment_booking_db
    .prepare('SELECT id FROM equipment WHERE id = ?')
    .bind(equipmentId)
    .first()

  if (!equipment) {
    return c.json({ error: 'Equipment not found' }, 400)
  }

  // 4. Check for overlapping booking
  const conflict = await c.env.equipment_booking_db
    .prepare(`
      SELECT id FROM bookings
      WHERE equipmentId = ?
      AND startAt < ?
      AND endAt > ?
    `)
    .bind(equipmentId, endAt, startAt)
    .first()

  if (conflict) {
    return c.json({ error: 'Booking time overlaps with an existing booking' }, 409)
  }

  // 5. Create booking
  const result = await c.env.equipment_booking_db
    .prepare(`
      INSERT INTO bookings
      (equipmentId, borrowerName, startAt, endAt, purpose)
      VALUES (?, ?, ?, ?, ?)
    `)
    .bind(
      equipmentId,
      borrowerName,
      startAt,
      endAt,
      purpose
    )
    .run()

  return c.json({
    id: result.meta.last_row_id,
    equipmentId,
    borrowerName,
    startAt,
    endAt,
    purpose
  }, 201)
})
// UPDATE a booking
app.patch('/bookings/:id', async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json()

  const {
    equipmentId,
    borrowerName,
    startAt,
    endAt,
    purpose
  } = body

  // Check required fields
  if (!equipmentId || !borrowerName || !startAt || !endAt || !purpose) {
    return c.json({ error: 'All fields are required' }, 400)
  }

  // Check start < end
  if (startAt >= endAt) {
    return c.json({ error: 'startAt must be before endAt' }, 400)
  }

  // Check booking exists
  const existing = await c.env.equipment_booking_db
    .prepare('SELECT id FROM bookings WHERE id = ?')
    .bind(id)
    .first()

  if (!existing) {
    return c.json({ error: 'Booking not found' }, 404)
  }

  // Check equipment exists
  const equipment = await c.env.equipment_booking_db
    .prepare('SELECT id FROM equipment WHERE id = ?')
    .bind(equipmentId)
    .first()

  if (!equipment) {
    return c.json({ error: 'Equipment not found' }, 400)
  }

  // Check overlap with OTHER bookings
  const conflict = await c.env.equipment_booking_db
    .prepare(`
      SELECT id FROM bookings
      WHERE equipmentId = ?
      AND id != ?
      AND startAt < ?
      AND endAt > ?
    `)
    .bind(equipmentId, id, endAt, startAt)
    .first()

  if (conflict) {
    return c.json({ error: 'Booking time overlaps with an existing booking' }, 409)
  }

  await c.env.equipment_booking_db
    .prepare(`
      UPDATE bookings
      SET equipmentId = ?,
          borrowerName = ?,
          startAt = ?,
          endAt = ?,
          purpose = ?
      WHERE id = ?
    `)
    .bind(
      equipmentId,
      borrowerName,
      startAt,
      endAt,
      purpose,
      id
    )
    .run()

  return c.json({
    id: Number(id),
    equipmentId,
    borrowerName,
    startAt,
    endAt,
    purpose
  }, 200)
})
// DELETE a booking
app.delete('/bookings/:id', async (c) => {
  const id = c.req.param('id')

  const existing = await c.env.equipment_booking_db
    .prepare('SELECT id FROM bookings WHERE id = ?')
    .bind(id)
    .first()

  if (!existing) {
    return c.json({ error: 'Booking not found' }, 404)
  }

  await c.env.equipment_booking_db
    .prepare('DELETE FROM bookings WHERE id = ?')
    .bind(id)
    .run()

  return c.body(null, 204)
})
export default app