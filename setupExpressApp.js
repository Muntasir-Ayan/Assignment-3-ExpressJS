const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;

// Folder structure
const folders = [
  'controllers',
  'data',
  'middleware',
  'routes',
  'uploads'
];

// Function to create folders
const createFolders = () => {
  folders.forEach(folder => {
    const dirPath = path.join(__dirname, folder);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
      console.log(`Created folder: ${folder}`);
    }
  });
};

// Function to create base files
const createFiles = () => {
  const files = {
    'controllers/hotelController.js': '',
    'data/<hotel_files>.json': '',
    'middleware/validation.js': '',
    'routes/hotelRoutes.js': '',
    'app.js': `
      const express = require('express');
      const app = express();
      const hotelRoutes = require('./routes/hotelRoutes');
      
      app.use(express.json());
      app.use('/api/hotels', hotelRoutes);
      
      const PORT = process.env.PORT || 3000;
      app.listen(PORT, () => console.log(\`Server running on port \${PORT}\`));
    `,
    '.gitignore': 'node_modules\nuploads\n'
  };

  for (const [filePath, content] of Object.entries(files)) {
    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
    fs.writeFileSync(path.join(__dirname, filePath), content);
    console.log(`Created file: ${filePath}`);
  }
};

// Initialize package.json and install express
const initPackageJson = () => {
  exec('npm init -y', (err) => {
    if (err) throw err;
    console.log('Initialized package.json');

    exec('npm install express', (err) => {
      if (err) throw err;
      console.log('Installed express');
    });
  });
};

// Run all functions
createFolders();
createFiles();
initPackageJson();
