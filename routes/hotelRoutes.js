const express = require('express');
const multer = require('multer');
const {
  getAllHotelIds,
  addHotel,
  getHotelById,
  updateHotel,
  uploadImages
} = require('../controllers/hotelController');
const { hotelValidation } = require('../middleware/validation');

const router = express.Router();
const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});
const upload = multer({ storage });

router.get('/hotels', getAllHotelIds);
router.post('/hotel', hotelValidation, addHotel);
router.get('/hotel/:hotelId', getHotelById);
router.put('/hotel/:hotelId', hotelValidation, updateHotel);
router.post('/images/:hotelId', upload.array('images', 10), uploadImages);

module.exports = router;
