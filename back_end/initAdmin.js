// initAdmin.js
const bcrypt = require('bcrypt');
const pool = require('./config/db');

async function createAdminUser() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const role = process.env.ADMIN_ROLE || 'admin';

  if (!email || !password) {
    console.warn('ADMIN_EMAIL o ADMIN_PASSWORD no definidos en el entorno');
    return;
  }

  try {
    const existing = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      console.log(`✅ Usuario admin "${email}" ya existe.`);
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO users (email, password, role) VALUES ($1, $2, $3)',
      [email, hashedPassword, role]
    );

    console.log(`✅ Usuario admin "${email}" creado exitosamente.`);
  } catch (err) {
    console.error('❌ Error creando usuario admin:', err.message);
  }
}

module.exports = createAdminUser;
