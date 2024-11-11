const fs = require('fs');
const path = require('path');

// Load data from data.json
const dataFilePath = path.join(__dirname, 'data', 'data.json');
const hotels = require(dataFilePath);

// Directory for saving individual hotel files
const hotelDir = path.join(__dirname, 'data');

// Function to save each hotel as a separate JSON file
const saveIndividualHotelFiles = (hotels) => {
  hotels.forEach(hotel => {
    const hotelFilePath = path.join(hotelDir, `${hotel.hotel_id}.json`);
    fs.writeFileSync(hotelFilePath, JSON.stringify(hotel, null, 2));
    console.log(`Saved ${hotelFilePath}`);
  });
};

// Run the function to save individual files
saveIndividualHotelFiles(hotels);
