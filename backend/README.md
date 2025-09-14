# TravelHub Backend API

A full-stack travel management application built with Express.js and MongoDB, featuring dynamic schemas and multilingual support.

## Features

- **Dynamic MongoDB Schemas**: Support for additional fields not defined in the base schema
- **Multilingual Support**: Content stored in both English and Arabic
- **Nested Collections**: Hotels linked to destinations with proper relationships
- **RESTful API**: Complete CRUD operations for destinations and hotels
- **Advanced Filtering**: Filter hotels by destination, price, rating, and amenities
- **Data Validation**: Comprehensive validation with proper error handling

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Security**: Helmet for security headers
- **CORS**: Cross-origin resource sharing enabled
- **Logging**: Morgan for HTTP request logging

## API Endpoints

### Destinations

- `GET /api/destinations` - Get all destinations
- `GET /api/destinations/:id` - Get destination by ID
- `POST /api/destinations` - Create new destination
- `PUT /api/destinations/:id` - Update destination
- `DELETE /api/destinations/:id` - Delete destination
- `GET /api/destinations/:id/hotels` - Get hotels for a destination

### Hotels

- `GET /api/hotels` - Get all hotels
- `GET /api/hotels/:id` - Get hotel by ID
- `POST /api/hotels` - Create new hotel
- `PUT /api/hotels/:id` - Update hotel
- `DELETE /api/hotels/:id` - Delete hotel
- `GET /api/hotels/destination/:destinationId` - Get hotels by destination
- `GET /api/hotels/search/filter` - Filter hotels with advanced criteria

### Health Check

- `GET /api/health` - API health status

## Installation & Setup

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Setup**
   Create a `.env` file in the backend directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/travelhub
   NODE_ENV=development
   ```

3. **Start MongoDB**
   Make sure MongoDB is running on your system:
   ```bash
   # Using MongoDB service
   sudo systemctl start mongod
   
   # Or using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

4. **Run the Server**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

## Database Schema

### Destination Model

```javascript
{
  name: String (required),
  country: String (required),
  description: String (required),
  imageUrl: String (optional),
  language: {
    en: { name: String, description: String },
    ar: { name: String, description: String }
  },
  // Dynamic fields support - any additional fields will be stored
  createdAt: Date,
  updatedAt: Date
}
```

### Hotel Model

```javascript
{
  name: String (required),
  destinationId: ObjectId (required, ref: 'Destination'),
  description: String (required),
  pricePerNight: Number (required, min: 0),
  rating: Number (required, min: 0, max: 5),
  amenities: [String],
  imageUrl: String (optional),
  language: {
    en: { name: String, description: String },
    ar: { name: String, description: String }
  },
  // Dynamic fields support - any additional fields will be stored
  createdAt: Date,
  updatedAt: Date
}
```

## Dynamic Schema Features

The application supports dynamic fields through Mongoose's `strict: false` option. This means:

- Any additional fields sent in API requests will be stored in MongoDB
- The schema can evolve without breaking existing data
- New features can be added without database migrations

## Multilingual Support

Content is stored in both English and Arabic:

- **Default Language**: English (fallback)
- **Arabic Support**: Right-to-left text direction
- **Automatic Fallback**: If language-specific content is missing, falls back to default

## API Response Format

All API responses follow this format:

```javascript
{
  success: boolean,
  data?: any,
  message?: string,
  error?: string,
  count?: number
}
```

## Error Handling

- **400**: Bad Request (validation errors)
- **404**: Not Found (resource doesn't exist)
- **500**: Internal Server Error (server-side errors)

## CORS Configuration

The API is configured to accept requests from:
- `http://localhost:3000` (development)
- `http://localhost:8080` (Vite development server)
- Production domains (configured via environment variables)

## Development

### Project Structure

```
backend/
├── config/
│   └── database.js          # MongoDB connection
├── models/
│   ├── Destination.js       # Destination schema
│   └── Hotel.js            # Hotel schema
├── routes/
│   ├── destinations.js     # Destination API routes
│   └── hotels.js          # Hotel API routes
├── server.js              # Main server file
├── package.json
└── README.md
```

### Adding New Features

1. **New Fields**: Add to the model schema or use dynamic fields
2. **New Endpoints**: Add routes to the appropriate route file
3. **New Models**: Create new model files in the `models/` directory

## Production Deployment

1. Set `NODE_ENV=production`
2. Configure production MongoDB URI
3. Set up proper CORS origins
4. Use process manager like PM2
5. Set up reverse proxy (nginx)

## Testing

Test the API using tools like:
- **Postman**: Import the API collection
- **curl**: Command-line testing
- **Frontend**: Use the React frontend application

## License

ISC License

