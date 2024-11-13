const request = require('supertest');
const fs = require('fs');
const path = require('path');
const app = require('./app'); // Assuming app.js is the main entry point
const { saveHotelData, loadHotelData } = require('./controllers/hotelController');

// Mock hotel data
const mockHotel = {
  hotel_id: "h001",
  title: "Hotel Test",
  guest_count: 4,
  slug: "hotel-test",
  images: []
};

// Utility functions for test setup and teardown
const mockDataPath = path.join(__dirname, '../data', `${mockHotel.hotel_id}.json`);
const cleanupMockData = () => {
  if (fs.existsSync(mockDataPath)) fs.unlinkSync(mockDataPath);
};

beforeEach(() => {
  cleanupMockData();
  saveHotelData(mockHotel); // Save initial mock data
});

afterEach(() => {
  cleanupMockData(); // Clean up mock data after each test
});

describe('Hotel API', () => {
  test('GET /hotels - should get all hotel IDs', async () => {
    const res = await request(app).get('/hotels');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toContain(mockHotel.hotel_id);
  });

  test('POST /hotel - should add a new hotel', async () => {
    const newHotel = { hotel_id: "h002", title: "Hotel New", guest_count: 3 };
    const res = await request(app)
      .post('/hotel')
      .send(newHotel);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('hotel_id', newHotel.hotel_id);
  });

  test('POST /hotel - should return 400 if hotel_id already exists', async () => {
    const res = await request(app)
      .post('/hotel')
      .send(mockHotel);
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'Hotel ID already exists');
  });

  test('GET /hotel/:hotelId - should get hotel by ID', async () => {
    const res = await request(app).get(`/hotel/${mockHotel.hotel_id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('hotel_id', mockHotel.hotel_id);
  });

  test('GET /hotel/:hotelId - should return 404 for non-existing hotel', async () => {
    const res = await request(app).get('/hotel/nonexistent');
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error', 'Hotel not found');
  });

  test('PUT /hotel/:hotelId - should update an existing hotel', async () => {
    const updatedHotel = { title: "Updated Hotel Test" };
    const res = await request(app)
      .put(`/hotel/${mockHotel.hotel_id}`)
      .send(updatedHotel);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('title', updatedHotel.title);
  });

  test('PUT /hotel/:hotelId - should return 404 for updating non-existing hotel', async () => {
    const res = await request(app)
      .put('/hotel/nonexistent')
      .send({ title: "Some Title" });
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error', 'Hotel not found');
  });

  test('POST /images/:hotelId - should upload images to hotel', async () => {
    const res = await request(app)
      .post(`/images/${mockHotel.hotel_id}`)
      .attach('images', Buffer.from('test image content'), { filename: 'test.jpg' })
      .attach('images', Buffer.from('test image content'), { filename: 'test2.jpg' });
    expect(res.statusCode).toBe(200);
    expect(res.body.images).toHaveLength(2);
  });

  test('POST /images/:hotelId - should return 404 for non-existing hotel', async () => {
    const res = await request(app)
      .post('/images/nonexistent')
      .attach('images', Buffer.from('test image content'), { filename: 'test.jpg' });
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error', 'Hotel not found');
  });
});
