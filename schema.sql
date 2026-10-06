CREATE TABLE equipment (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  equipmentId TEXT NOT NULL,
  borrowerName TEXT NOT NULL,
  startAt TEXT NOT NULL,
  endAt TEXT NOT NULL,
  purpose TEXT NOT NULL,
  FOREIGN KEY (equipmentId) REFERENCES equipment(id)
);

INSERT INTO equipment (id, name) VALUES
  ('eq-1', 'Projector'),
  ('eq-2', 'Camera');