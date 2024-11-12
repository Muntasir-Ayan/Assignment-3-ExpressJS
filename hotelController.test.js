const request = require('supertest');
const app = require('../app');

describe('Hotel API', () => {
  it('should get all hotel IDs', async () => {
    const res = await request(app).get('/hotels');
    expect(res.statusCode).toBe(200);
  });
  
  // Add more tests for POST, PUT, GET /hotel/:id
});
