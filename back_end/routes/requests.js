const express = require('express');
const pool = require('../config/db');
const { verifyToken, checkRole } = require('../middleware/auth');
const router = express.Router();

// Obtener solicitudes con email del usuario que las creó
router.get('/', verifyToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const user = req.query.user || ''; // nuevo filtro
    const offset = (page - 1) * limit;

    const values = [`%${search}%`, limit, offset];
    let query = `
      SELECT r.id, r.description, u.email AS user_email
      FROM requests r
      JOIN users u ON r.user_id = u.id
      WHERE r.description ILIKE $1
    `;

    if (user) {
      query += ' AND u.email ILIKE $4';
      values.push(`%${user}%`);
    }

    query += ' ORDER BY r.id DESC LIMIT $2 OFFSET $3';

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error('🔥 Error al consultar solicitudes:', err.message);
    res.status(500).json({ message: 'Error al consultar solicitudes' });
  }
});


// Crear nueva solicitud y asociarla al usuario autenticado
router.post('/', verifyToken, async (req, res) => {
  try {
    const { description } = req.body;

    if (!description) {
      return res.status(400).json({ message: 'La descripción es obligatoria' });
    }

    await pool.query(
      'INSERT INTO requests (description, user_id) VALUES ($1, $2)',
      [description, req.user.id]
    );

    res.status(201).json({ message: 'Solicitud creada' });
  } catch (err) {
    console.error('🔥 Error al crear solicitud:', err.message);
    res.status(500).json({ message: 'Error al crear solicitud' });
  }
});

// Eliminar solicitud (solo admin)
router.delete('/:id', verifyToken, checkRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM requests WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Solicitud no encontrada' });
    }

    res.json({ message: 'Solicitud eliminada' });
  } catch (err) {
    console.error('🔥 Error al eliminar solicitud:', err.message);
    res.status(500).json({ message: 'Error al eliminar solicitud' });
  }
});

module.exports = router;
