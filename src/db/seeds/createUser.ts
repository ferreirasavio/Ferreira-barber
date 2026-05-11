import bcrypt from 'bcrypt';
import pool from '../connection';

async function seed() {
    const hashedPassword = await bcrypt.hash('123456', 10);

    try {
        // Insere o Admin
        await pool.query(
            `INSERT INTO users (name, email, password, role)
       VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO NOTHING`,
            ['Admin Ferreira', 'admin@ferreira.com', hashedPassword, 'admin']
        );

        // Insere o Cliente
        await pool.query(
            `INSERT INTO users (name, email, password, role)
       VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO NOTHING`,
            ['João Cliente', 'joao@gmail.com', hashedPassword, 'user']
        );

        console.log("✅ Usuários de teste criados com sucesso!");
        process.exit(0);
    } catch (err) {
        console.error("❌ Erro ao criar usuários:", err);
        process.exit(1);
    }
}

seed();