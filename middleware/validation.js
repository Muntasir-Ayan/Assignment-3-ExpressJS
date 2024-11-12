const { body } = require('express-validator');

const hotelValidation = [
  body('hotel_id').notEmpty().withMessage('Hotel ID is required'),
  body('title').notEmpty().withMessage('Title is required'),
  body('slug').optional(),
  body('guest_count').isInt({ min: 1 }).withMessage('Guest count must be a number')
];

module.exports = { hotelValidation };
