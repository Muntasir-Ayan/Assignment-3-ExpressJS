const request = require('supertest');
const app = require('../app');

describe('Hotel API', () => {
  it('should get all hotel IDs', async () => {
    const res = await request(app).get('/hotels');
    expect(res.statusCode).toBe(200);
  });

  it('should add a new hotel', async () => {
    const res = await request(app)
      .post('/hotel')
      .send({ hotel_id: 'h004', title: 'Hotel Four', guest_count: 4 });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('hotel_id', 'h004');
  });

  it('should return 404 for non-existing hotel', async () => {
    const res = await request(app).get('/hotel/nonexistent');
    expect(res.statusCode).toBe(404);
  });

  // Add additional tests for PUT and image upload endpoints
});
