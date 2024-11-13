# Express REST API for Hotel Management

This project is a RESTful API built with Node.js and Express.js for managing hotel data. It supports creating, updating, retrieving, and uploading images for hotels and includes robust validation, error handling, and unit testing. The project is modularized for easy maintenance and scalability, with routes, controllers, middleware, and configurations separated by concerns.

## Features

- **RESTful Endpoints**: CRUD operations for hotel data management.
- **Image Upload**: Image upload functionality using Multer.
- **Validation**: Input validation for POST and PUT requests with Express Validator.
- **Slug Generation**: Automatic slug generation for hotel titles.
- **Unit Testing**: Comprehensive testing with Jest and Supertest.
- **Modular Structure**: Clear separation of routes, controllers, and validation logic.
- **Static File Serving**: Serves uploaded images as static files.

## Technologies Used

- **Node.js** and **Express.js**: Server and REST API.
- **Multer**: For file uploads.
- **Express Validator**: For validating API request payloads.
- **Slugify**: To convert titles into URL-friendly slugs.
- **Jest** and **Supertest**: For unit testing and API testing.
- **ESLint**: For code linting and enforcing best practices.

## Folder Structure

├── controllers          # Controllers for handling API requests <br>
│   └── hotelController.js <br>
├── data                 # Data storage (individual hotel files stored as JSON) <br>
├── middleware           # Validation middleware <br>
│   └── validation.js <br>
├── routes               # Routing logic <br>
│   └── hotelRoutes.js <br>
├── uploads              # Directory for uploaded images <br>
├── app.js               # Main application file <br>
├── app.js               # Main server file <br>
└── setupExpressApp.js   # Script for setting up the project structure <br>
└── package.json <br>



## Getting Started

### Prerequisites

- **Node.js** (version >= 14.x)
- **npm** (version >= 6.x)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Muntasir-Ayan/Assignment-3-ExpressJS.git
   cd Assignment-3-ExpressJS
2. **Install Dependencies:** 
   npm install

3. **Another way for copying the project:**

   node setupExpressApp.js  #This will create the project structure and you can paste all file


### Api Endpoints
  -  GET /hotels: Retrieve all hotel IDs.
  -  POST /hotel: Add a new hotel.
  -  GET /hotel/: Get hotel details by ID.
  -  PUT /hotel/: Update hotel information.
  -  POST /images/: Upload images for a hotel.
  <br>more idea will get on "file.txt"

### Validation Rules
- hotel_id: Required, unique for each hotel.
- title: Required.
- guest_count: Must be an integer greater than or equal to 1.
- slug: auto-generated from the title.


### Testing 
    npm test

### Error Handling
    Each endpoint includes comprehensive error handling, returning appropriate HTTP status codes and error messages:

    400 Bad Request: Invalid or missing data fields.
    404 Not Found: Hotel not found for given ID.
    500 Internal Server Error: Server-side issues.

### License
    This project is licensed under the MIT License.

--- 

Copy this content directly to your `README.md` file. It provides a structured overview of your project and details all the main features, endpoints, setup steps, and technologies.



