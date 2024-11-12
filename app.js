const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const app = express();

app.use(express.json());

// Directory paths
const hotelDir = './data';  // Folder containing hotel JSON files
const uploadsDir = './uploads';

// Helper function to save individual hotel data to its own JSON file
const saveHotelData = (hotel) => {
  const hotelFilePath = path.join(hotelDir, `${hotel.hotel_id}.json`);
  fs.writeFileSync(hotelFilePath, JSON.stringify(hotel, null, 2));
};

// Helper function to load an individual hotel by ID from its JSON file
const loadHotelData = (hotelId) => {
  const hotelFilePath = path.join(hotelDir, `${hotelId}.json`);
  if (fs.existsSync(hotelFilePath)) {
    return JSON.parse(fs.readFileSync(hotelFilePath, 'utf-8'));
  }
  return null;
};

// Helper function to get all hotel ids (get all hotel files in the directory)
const getAllHotelIds = () => {
  const files = fs.readdirSync(hotelDir);
  return files
    .filter(file => file.endsWith('.json') && file !== 'data.json')
    .map(file => file.replace('.json', ''));
};

// Route: GET /hotels - List all hotels by their IDs
app.get('/hotels', (req, res) => {
  const hotelIds = getAllHotelIds();
  res.status(200).json(hotelIds); // Return only hotel IDs to avoid loading all data
});

// Route: POST /hotel - Add a new hotel
app.post('/hotel', (req, res) => {
  const newHotel = req.body;

  // Validate required fields
  if (!newHotel.hotel_id || !newHotel.slug || !newHotel.title) {
    return res.status(400).json({ error: 'Missing required hotel fields' });
  }

  // Check for duplicate hotel ID
  if (fs.existsSync(path.join(hotelDir, `${newHotel.hotel_id}.json`))) {
    return res.status(400).json({ error: 'Hotel ID already exists' });
  }

  // Save new hotel data
  saveHotelData(newHotel);

  res.status(201).json(newHotel);
});

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });

// Route: POST /images/:hotelId - Upload multiple images for a specific hotel
app.post('/images/:hotelId', upload.array('images', 10), (req, res) => {
  const hotelId = req.params.hotelId;
  const hotel = loadHotelData(hotelId);

  if (!hotel) return res.status(404).json({ error: 'Hotel not found' });

  // Add new image URLs to the hotel data
  req.files.forEach((file) => {
    const imageUrl = `/uploads/${file.filename}`;
    if (!hotel.images) {
      console.log("enter here")
      hotel.images = [];
    }
    hotel.images.push(imageUrl);
  });

  // Save updated hotel data
  saveHotelData(hotel);

  res.status(200).json(hotel);
});

// Route: GET /hotel/:hotelId - Retrieve a hotel by ID
app.get('/hotel/:hotelId', (req, res) => {
  const hotelId = req.params.hotelId;
  const hotel = loadHotelData(hotelId);

  if (!hotel) return res.status(404).json({ error: 'Hotel not found' });

  res.status(200).json(hotel);
});

// Route: PUT /hotel/:hotelId - Update a hotel's information by ID
app.put('/hotel/:hotelId', (req, res) => {
  const hotelId = req.params.hotelId;
  const updatedData = req.body;
  const hotel = loadHotelData(hotelId);

  if (!hotel) return res.status(404).json({ error: 'Hotel not found' });

  // Update hotel data
  const updatedHotel = { ...hotel, ...updatedData };
  saveHotelData(updatedHotel);

  res.status(200).json(updatedHotel);
});

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Server setup
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
