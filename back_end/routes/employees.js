const express = require('express');
const pool = require('../config/db');
const { verifyToken, checkRole  } = require('../middleware/auth');
const router = express.Router();

// Obtener empleados con paginación y búsqueda
router.get('/', verifyToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const offset = (page - 1) * limit;

    const query = `
      SELECT * FROM employees
      WHERE name ILIKE $1
      ORDER BY id DESC
      LIMIT $2 OFFSET $3
    `;
    const values = [`%${search}%`, limit, offset];

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error('🔥 Error al consultar empleados:', err.message);
    res.status(500).json({ message: 'Error al consultar empleados' });
  }
});

// Crear nuevo empleado

router.post('/', verifyToken, async (req, res) => {
  try {
    const { name, position, fecha_ingreso, salario } = req.body;

    if (!name || !position || !fecha_ingreso || !salario) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    await pool.query(
      'INSERT INTO employees (name, position, fecha_ingreso, salario) VALUES ($1, $2, $3, $4)',
      [name, position, fecha_ingreso, salario]
    );

    res.status(201).json({ message: 'Empleado creado' });
  } catch (err) {
    console.error('🔥 Error al crear empleado:', err.message);
    res.status(500).json({ message: 'Error al crear empleado' });
  }
});

// Eliminar empleado (solo admin)
router.delete('/:id', verifyToken, checkRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM employees WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Empleado no encontrado' });
    }

    res.json({ message: 'Empleado eliminado' });
  } catch (err) {
    console.error('🔥 Error al eliminar empleado:', err.message);
    res.status(500).json({ message: 'Error al eliminar empleado' });
  }
});

module.exports = router;
