const express = require('express');
const hotelRoutes = require('./routes/hotelRoutes');
const path = require('path');

const app = express();
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/', hotelRoutes);

// const port = process.env.PORT || 3000;
// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });


module.exports = app; 