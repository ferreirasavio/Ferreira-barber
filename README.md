# Ferreira Barber API

API de agendamento para barbearia usando Node.js, Express, TypeScript e PostgreSQL, preparada para deploy serverless na AWS Lambda.

## 🚀 Tecnologias

- Node.js + TypeScript
- Express.js
- PostgreSQL
- AWS Lambda (Serverless)
- Serverless Framework

## 📋 Pré-requisitos

- Node.js 18+
- Conta Supabase (gratuita)
- AWS CLI configurado
- Conta AWS (free tier)

## 🛠️ Configuração

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar variáveis de ambiente
Copie o arquivo `.env.example` para `.env`:
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações do Supabase:
```env
DB_HOST=db.your-project.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your_supabase_password
PORT=3000
NODE_ENV=development
```

### 3. Banco de dados
Acesse [Supabase](https://supabase.com), crie um projeto e execute no SQL Editor:
```sql
CREATE TABLE schedule (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  scheduled_at TIMESTAMP NOT NULL,
  type_cut VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🏃‍♂️ Executando

### Desenvolvimento local
```bash
npm run dev
```

### Build para produção
```bash
npm run build
npm start
```

### Serverless offline (simula Lambda)
```bash
npm run offline
```

## 📡 Endpoints

- `GET /health` - Health check
- `GET /api/schedules` - Listar agendamentos
- `POST /api/schedules` - Criar agendamento
- `PUT /api/schedules/:id` - Atualizar agendamento
- `DELETE /api/schedules/:id` - Deletar agendamento

### Exemplo de uso no Postman

**POST /api/schedules**
```json
{
  "name": "João Silva",
  "phone": "(11) 99999-9999",
  "scheduled_at": "2025-09-20 14:30:00",
  "type_cut": "cabelo e barba"
}
```

## ☁️ Deploy na AWS (GRATUITO)

### 1. Configurar AWS CLI
```bash
aws configure
```

### 2. Banco de dados na AWS
Você já está usando **Supabase** (PostgreSQL gratuito para sempre)
- ✅ **500 MB grátis** para sempre
- ✅ **Zero configuração** adicional
- ✅ **Interface web** para gerenciar dados

### 3. Deploy
```bash
npm run deploy
```

### 4. Configurar variáveis de ambiente na AWS
No AWS Lambda Console, adicione as variáveis do seu Supabase:
- DB_HOST (ex: db.abc123.supabase.co)
- DB_PORT (5432)
- DB_NAME (postgres)
- DB_USER (postgres)
- DB_PASSWORD (sua senha do Supabase)

## 💰 Custos AWS (Free Tier)

- **Lambda**: 1M execuções grátis/mês
- **API Gateway**: 1M requests grátis/mês
- **Supabase**: 500 MB grátis para sempre

Total: **R$ 0,00/mês** para sempre! 🎉

## 🔧 Scripts disponíveis

- `npm run dev` - Desenvolvimento local
- `npm run build` - Build TypeScript
- `npm start` - Executar produção local
- `npm run offline` - Simular Lambda localmente
- `npm run deploy` - Deploy para AWS
- `npm run deploy:dev` - Deploy ambiente dev
- `npm run deploy:prod` - Deploy ambiente produção

## 📝 Notas importantes

1. **Conexões de banco**: Lambda usa max 1 conexão por instância
2. **Cold start**: Primeira execução pode ser mais lenta
3. **Supabase**: Gratuito para sempre, sem limite de tempo
4. **SSL**: Supabase já vem configurado com SSL
