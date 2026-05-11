DROP TABLE IF EXISTS schedules;
DROP TABLE IF EXISTS users;
DROP TYPE IF EXISTS user_role;
DROP TYPE IF EXISTS cut_type_enum;

-- 1. Criar os Tipos
CREATE TYPE user_role AS ENUM ('user', 'manager', 'admin');
CREATE TYPE cut_type_enum AS ENUM ('cabelo', 'barba', 'cabelo e barba');

-- 2. Criar Tabela de Usuários (DEVE vir antes de schedules)
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Criar Tabela de Agendamentos
CREATE TABLE schedules (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(14),
  scheduled_at TIMESTAMP NOT NULL,
  type_cut cut_type_enum NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE -- Adicionada a vírgula que faltava
);

-- 4. Inserir Usuários de Mock (IDs 1 e 2)
INSERT INTO users (name, email, password, role) VALUES
('Admin Ferreira', 'admin@ferreira.com', '$2b$10$7vM.Z9O1qY.r6Yp8A5.WueZ8pX.Y1yG1yG1yG1yG1yG1yG1yG1yG', 'admin'),
('João Cliente', 'joao@gmail.com', '$2b$10$7vM.Z9O1qY.r6Yp8A5.WueZ8pX.Y1yG1yG1yG1yG1yG1yG1yG1yG', 'user');

-- 5. Inserir Agendamentos (Viculando aos IDs dos usuários criados acima)
-- Distribuí entre o user_id 1 e 2 para você ter dados em ambos
INSERT INTO schedules (name, phone, scheduled_at, type_cut, user_id) VALUES
('Sávio Oliveira', '21981818181', '2026-04-03 10:00:00', 'barba', 1),
('Lucas Silva', '21977776666', '2026-04-03 11:00:00', 'cabelo', 2),
('André Santos', '11988887777', '2026-04-03 14:30:00', 'cabelo e barba', 1),
('Marcos Souza', '21966665555', '2026-04-03 16:00:00', 'cabelo', 2),
('Felipe Neto', '21955554444', '2026-04-03 17:00:00', 'barba', 1),
('Ricardo Alves', '11944443333', '2026-04-04 09:00:00', 'cabelo', 2),
('Bruno Lima', '21933332222', '2026-04-04 10:30:00', 'cabelo e barba', 1),
('Gabriel Costa', '21922221111', '2026-04-04 13:00:00', 'barba', 2),
('Thiago Pereira', '11911110000', '2026-04-04 15:00:00', 'cabelo', 5),
('Vinicius Junior', '21999998888', '2026-04-04 18:30:00', 'cabelo e barba', 2),
('Diego Rocha', '21988881234', '2026-04-05 08:00:00', 'cabelo', 1),
('Mateus Henrique', '11977774321', '2026-04-05 10:00:00', 'barba', 2),
('Rodrigo Faro', '21966660000', '2026-04-05 11:30:00', 'cabelo', 1),
('Hugo Gloss', '21955551111', '2026-04-05 14:00:00', 'cabelo e barba', 5),
('Igor 3K', '11944442222', '2026-04-05 16:30:00', 'barba', 5),
('Caio Castro', '21933333333', '2026-04-06 09:00:00', 'cabelo', 5),
('Daniel Alves', '21922224444', '2026-04-06 10:00:00', 'cabelo', 5),
('Enzo Ramos', '11911115555', '2026-04-06 12:00:00', 'cabelo e barba', 2),
('Fabio Porchat', '21999996666', '2026-04-06 14:00:00', 'barba', 1),
('Gustavo Lima', '21988887777', '2026-04-06 16:00:00', 'cabelo', 2),
('Jorge Aragão', '11977778888', '2026-04-07 10:00:00', 'cabelo e barba', 1),
('Leonardo Silva', '21966669999', '2026-04-07 11:30:00', 'cabelo', 2),
('Murilo Couto', '21955550000', '2026-04-07 15:00:00', 'barba', 1),
('Otávio Mesquita', '11944441111', '2026-04-07 17:00:00', 'cabelo', 5),
('Paulo Muzy', '21933332222', '2026-04-07 19:00:00', 'cabelo e barba', 1);