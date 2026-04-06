CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TYPE cut_type_enum AS ENUM ('cabelo', 'barba', 'cabelo e barba');


CREATE TABLE IF NOT EXISTS schedules (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(14),
  scheduled_at TIMESTAMP NOT NULL,
  type_cut cut_type_enum NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO schedules (name, phone, scheduled_at, type_cut) VALUES
('Sávio Oliveira', '21981818181', '2026-04-03 10:00:00', 'barba'),
('Lucas Silva', '21977776666', '2026-04-03 11:00:00', 'cabelo'),
('André Santos', '11988887777', '2026-04-03 14:30:00', 'cabelo e barba'),
('Marcos Souza', '21966665555', '2026-04-03 16:00:00', 'cabelo'),
('Felipe Neto', '21955554444', '2026-04-03 17:00:00', 'barba'),
('Ricardo Alves', '11944443333', '2026-04-04 09:00:00', 'cabelo'),
('Bruno Lima', '21933332222', '2026-04-04 10:30:00', 'cabelo e barba'),
('Gabriel Costa', '21922221111', '2026-04-04 13:00:00', 'barba'),
('Thiago Pereira', '11911110000', '2026-04-04 15:00:00', 'cabelo'),
('Vinicius Junior', '21999998888', '2026-04-04 18:30:00', 'cabelo e barba'),
('Diego Rocha', '21988881234', '2026-04-05 08:00:00', 'cabelo'),
('Mateus Henrique', '11977774321', '2026-04-05 10:00:00', 'barba'),
('Rodrigo Faro', '21966660000', '2026-04-05 11:30:00', 'cabelo'),
('Hugo Gloss', '21955551111', '2026-04-05 14:00:00', 'cabelo e barba'),
('Igor 3K', '11944442222', '2026-04-05 16:30:00', 'barba'),
('Caio Castro', '21933333333', '2026-04-06 09:00:00', 'cabelo'),
('Daniel Alves', '21922224444', '2026-04-06 10:00:00', 'cabelo'),
('Enzo Ramos', '11911115555', '2026-04-06 12:00:00', 'cabelo e barba'),
('Fabio Porchat', '21999996666', '2026-04-06 14:00:00', 'barba'),
('Gustavo Lima', '21988887777', '2026-04-06 16:00:00', 'cabelo'),
('Jorge Aragão', '11977778888', '2026-04-07 10:00:00', 'cabelo e barba'),
('Leonardo Silva', '21966669999', '2026-04-07 11:30:00', 'cabelo'),
('Murilo Couto', '21955550000', '2026-04-07 15:00:00', 'barba'),
('Otávio Mesquita', '11944441111', '2026-04-07 17:00:00', 'cabelo'),
('Paulo Muzy', '21933332222', '2026-04-07 19:00:00', 'cabelo e barba');