# Marketplace Application - Odoo x NMIT Virtual Round

A full-stack marketplace application built with React (TypeScript) frontend and Node.js/Express backend, featuring user authentication, product listings, image uploads, and purchase request management.

## 🚀 Features

- **User Authentication**: JWT-based authentication with registration and login
- **Product Management**: Create, view, edit, and delete product listings
- **Image Upload**: Upload and display product images with file validation
- **Purchase Requests**: Send and manage purchase requests between buyers and sellers
- **User Dashboard**: View personal listings, purchase history, and purchase requests
- **Real-time Status Updates**: Track purchase request statuses (pending, accepted, rejected, completed)
- **Responsive Design**: Modern UI built with Tailwind CSS and shadcn/ui components

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **React Hook Form** with Zod validation
- **React Router** for navigation
- **Lucide React** for icons

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Multer** for file uploads
- **bcryptjs** for password hashing
- **CORS** for cross-origin requests

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Odoo-nmit
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
MONGO_URI=mongodb://localhost:27017/marketplace
JWT_SECRET=your-super-secret-jwt-key
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=30d
FRONTEND_URL=http://localhost:5173
PORT=4000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:4000
```

### 4. Database Setup
```bash
cd backend
npm run seed
```

## 🚀 Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```
Server runs on http://localhost:4000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Application runs on http://localhost:5173

### Production Build

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

## 🐳 Docker Setup

### Using Docker Compose (Recommended)
```bash
docker-compose up --build
```

This will start:
- Frontend on http://localhost:3000
- Backend on http://localhost:4000
- MongoDB on port 27017

### Individual Docker Builds

**Backend:**
```bash
cd backend
docker build -t marketplace-backend .
docker run -p 4000:4000 --env-file .env marketplace-backend
```

**Frontend:**
```bash
cd frontend
docker build -t marketplace-frontend .
docker run -p 3000:3000 marketplace-frontend
```

## 📁 Project Structure

```
Odoo-nmit/
├── backend/
│   ├── src/
│   │   ├── auth/           # Authentication middleware & controllers
│   │   ├── config/         # Database configuration
│   │   ├── middleware/     # Custom middleware (upload, etc.)
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   └── utils/          # Utility functions & seed data
│   ├── public/uploads/     # Uploaded images storage
│   ├── server.js           # Express server entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── contexts/       # React contexts (Auth, etc.)
│   │   ├── lib/           # API client & utilities
│   │   ├── pages/         # Page components
│   │   └── assets/        # Static assets
│   ├── public/            # Public assets
│   └── package.json
├── docker-compose.yml     # Multi-service Docker setup
└── README.md
```

## 🔑 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/profile` - Get user profile
- `PUT /auth/profile` - Update user profile

### Products
- `GET /products` - Get all products
- `POST /products` - Create new product
- `GET /products/:id` - Get product by ID
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product
- `POST /products/upload` - Upload product image

### Purchase Requests
- `POST /purchase-requests` - Create purchase request
- `GET /purchase-requests/received` - Get received requests (seller)
- `GET /purchase-requests/sent` - Get sent requests (buyer)
- `PATCH /purchase-requests/:id/status` - Update request status
- `GET /purchase-requests/:id` - Get request details

### Orders
- `GET /orders` - Get user's order history

## 🔒 Environment Variables

### Backend (.env)
```env
MONGO_URI=mongodb://localhost:27017/marketplace
JWT_SECRET=your-super-secret-jwt-key
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=30d
FRONTEND_URL=http://localhost:5173
PORT=4000
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:4000
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm run test
```

## 🚀 Deployment

### Production Environment Setup
1. Set up MongoDB Atlas or production MongoDB instance
2. Update environment variables for production
3. Build frontend for production
4. Deploy backend to your preferred hosting service
5. Configure reverse proxy (nginx) if needed

### Docker Production Deployment
```bash
docker-compose -f docker-compose.prod.yml up --build -d
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running locally or check Atlas connection string
   - Verify MONGO_URI in .env file

2. **CORS Issues**
   - Check FRONTEND_URL in backend .env
   - Ensure frontend is running on the correct port

3. **Image Upload Issues**
   - Verify `public/uploads` directory exists in backend
   - Check file permissions

4. **JWT Token Issues**
   - Clear localStorage in browser
   - Check JWT_SECRET consistency

### Support

For issues and questions, please create an issue in the repository or contact the development team.

---

**Built with ❤️ for Odoo x NMIT Virtual Round**
