const request = require('supertest');
const app = require('../app');
const pool = require('../config/db');

describe('API /api/requests', () => {
  let token;

  beforeAll(async () => {
    // Crear un usuario admin temporal para autenticación
    const email = `admin${Date.now()}@test.com`;
    const password = '123456';

    await request(app).post('/api/auth/register').send({
      email,
      password,
      role: 'admin',
    });

    const res = await request(app).post('/api/auth/login').send({ email, password });
    token = res.body.token;
  });

  afterAll(async () => {
    await pool.end(); // Cierra la conexión a la base de datos
  });

  test('Debe crear una solicitud con descripción válida', async () => {
    const res = await request(app)
      .post('/api/requests')
      .set('Authorization', `Bearer ${token}`)
      .send({ description: 'Prueba de solicitud' });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('Solicitud creada');
  });

  test('Debe fallar si no se envía descripción', async () => {
    const res = await request(app)
      .post('/api/requests')
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('La descripción es obligatoria');
  });

  test('Debe obtener todas las solicitudes', async () => {
    const res = await request(app)
      .get('/api/requests')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('Debe fallar al eliminar solicitud que no existe', async () => {
    const res = await request(app)
      .delete('/api/requests/999999') // ID inexistente
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('Solicitud no encontrada');
  });
});
