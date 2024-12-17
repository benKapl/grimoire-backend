const request = require('supertest');
const app = require('../app');

it('POST /BY/DATE', async () => {
  const newDate = new Date("2024-12-14T22:42:03.651+00:00");

  const res = await request(app).post('/notes/by/date').send({
    date: newDate.toISOString(), 
  });

  expect(res.statusCode).toBe(200);
  expect(res.body.result).toBe(true); 
  expect(Array.isArray(res.body.notes)).toBe(true); 
});