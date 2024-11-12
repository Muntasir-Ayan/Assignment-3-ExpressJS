const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const app = express();

app.use(express.json());

// Directory paths
const dataFilePath = './data/data.json';
const hotelDir = './data';
const uploadsDir = './uploads';

// Load main data array from data.json
let hotels = require(dataFilePath);

// Helper function to save main data array to data.json
const saveMainData = () => {
  // stringify(value, replacer, space) space gives a better view
  fs.writeFileSync(dataFilePath, JSON.stringify(hotels, null, 2));
};

// Helper function to save each hotel to its own JSON file
const saveHotelData = (hotel) => {
  const hotelFilePath = path.join(hotelDir, `${hotel.hotel_id}.json`);
  fs.writeFileSync(hotelFilePath, JSON.stringify(hotel, null, 2));
};

// Helper function to load an individual hotel by ID from its JSON file
const loadHotelData = (hotelId) => {
  const hotelFilePath = path.join(hotelDir, `${hotelId}.json`);
  if (fs.existsSync(hotelFilePath)) {
    //fs.readFileSync(hotelFilePath, 'utf-8') return a string file and JSON.parse convert it into JSON format.
    return JSON.parse(fs.readFileSync(hotelFilePath, 'utf-8'));
  }
  return null;
};

// //see all hotels
// app.get('/hotels', (req, res) => {

//   res.status(200).json(dataFilePath);

// });


// Route: POST /hotel - Add a new hotel
app.post('/hotel', (req, res) => {
  const newHotel = req.body;

  // Validate required fields
  if (!newHotel.hotel_id || !newHotel.slug || !newHotel.title) {
    return res.status(400).json({ error: 'Missing required hotel fields' });
  }

  // Check for duplicate hotel ID
  if (hotels.some(h => h.hotel_id === newHotel.hotel_id)) {
    return res.status(400).json({ error: 'Hotel ID already exists' });
  }

  // Save new hotel data
  hotels.push(newHotel);
  saveMainData();
  saveHotelData(newHotel);

  res.status(201).json(newHotel);
});

// Configure multer for image upload
//multer.diskStorage(destination,filename) helps to difine the location
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
    hotel.images.push(imageUrl);
  });

  // Update data files
  const hotelIndex = hotels.findIndex((h) => h.hotel_id === hotelId);
  hotels[hotelIndex] = hotel;
  saveMainData();
  saveHotelData(hotel);

  res.status(200).json(hotel);
});

// Route: GET /hotel/:hotelId - Retrieve a hotel by ID or slug
app.get('/hotel/:hotelId', (req, res) => {
  const hotelId = req.params.hotelId;
  const hotel = hotels.find((h) => h.hotel_id === hotelId || h.slug === hotelId);

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
   //creates two object existing hotel data and updated hotel data to merge
  const updatedHotel = { ...hotel, ...updatedData }; 
  const hotelIndex = hotels.findIndex((h) => h.hotel_id === hotelId);
  hotels[hotelIndex] = updatedHotel;

  // Save updates to main data file and individual hotel file
  saveMainData();
  saveHotelData(updatedHotel);

  res.status(200).json(updatedHotel);
});

// Serve uploaded images statically
// making accessable link of images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Server setup
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
