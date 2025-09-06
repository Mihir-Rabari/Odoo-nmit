# EcoFinds Marketplace - Setup Instructions

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- Git

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Configuration:**
   - Copy `.env.example` to `.env`
   - Update the following variables in `.env`:
   ```env
   PORT=4000
   MONGO_URI=mongodb://localhost:27017/ecofinds
   # OR for MongoDB Atlas:
   # MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ecofinds?retryWrites=true&w=majority
   
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_ACCESS_EXPIRES=15m
   JWT_REFRESH_EXPIRES=30d
   
   FRONTEND_URL=http://localhost:8080
   RATE_LIMIT_WINDOW_MS=60000
   RATE_LIMIT_MAX=100
   ```

4. **Start the backend server:**
   ```bash
   npm run start
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Configuration:**
   - Update `.env` file:
   ```env
   VITE_API_URL=http://localhost:4000/api/v1
   ```

4. **Start the frontend development server:**
   ```bash
   npm run dev
   ```

### Access the Application
- **Frontend:** http://localhost:8080
- **Backend API:** http://localhost:4000/api/v1

## 🔧 Features Implemented

### ✅ Authentication System
- **Email/Password Registration & Login**
- JWT token-based authentication
- Protected routes and middleware
- User profile management

### ✅ Product Management
- **Sell Items:** Complete form with image uploads
- **Browse Marketplace:** View all listed products
- **Product Details:** Detailed product pages
- **My Listings:** Manage your own products

### ✅ File Upload System
- **Multer Integration:** Server-side file handling
- **Public Storage:** Images stored in `/public/uploads/`
- **Static File Serving:** Images accessible via `/uploads/` endpoint

### ✅ Purchase Request System
- **Request to Buy:** Buyers can make purchase requests
- **Seller Dashboard:** View and manage incoming requests
- **Status Management:** Accept, reject, or complete requests
- **Communication:** Built-in messaging system

### ✅ Enhanced Dashboard
- **4 Main Tabs:**
  1. **Sell Item** - List new products
  2. **My Listings** - Manage your products
  3. **Purchase Requests** - Handle buyer requests
  4. **Purchases** - Track your buying history

### ✅ Comprehensive Logging
- **Frontend:** Console logging for debugging
- **Backend:** Detailed request/response logging
- Error tracking and debugging information

## 🗂️ Project Structure

```
EcoFinds/
├── backend/
│   ├── public/uploads/          # Uploaded images
│   ├── src/
│   │   ├── auth/               # Authentication logic
│   │   ├── models/             # Database models
│   │   ├── routes/             # API routes
│   │   ├── middleware/         # Custom middleware
│   │   └── utils/              # Utility functions
│   ├── server.js               # Main server file
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── pages/              # Page components
│   │   ├── contexts/           # React contexts
│   │   ├── lib/                # Utility libraries
│   │   └── hooks/              # Custom hooks
│   └── package.json
└── README.md
```

## 🔍 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `PUT /api/v1/auth/profile` - Update profile

### Products
- `GET /api/v1/products` - Get all products
- `GET /api/v1/products/:id` - Get single product
- `POST /api/v1/products` - Create product
- `POST /api/v1/products/upload` - Upload product image
- `PUT /api/v1/products/:id` - Update product
- `DELETE /api/v1/products/:id` - Delete product

### Purchase Requests
- `POST /api/v1/purchase-requests` - Create purchase request
- `GET /api/v1/purchase-requests/received` - Get received requests (seller)
- `GET /api/v1/purchase-requests/sent` - Get sent requests (buyer)
- `PATCH /api/v1/purchase-requests/:id/status` - Update request status

## 🐛 Troubleshooting

### Common Issues

1. **Backend won't start:**
   - Check if MongoDB is running
   - Verify `.env` file exists and has correct values
   - Ensure port 4000 is not in use

2. **Frontend build errors:**
   - Run `npm install` to ensure all dependencies are installed
   - Check for TypeScript errors in the console

3. **Image upload fails:**
   - Verify `public/uploads/` directory exists
   - Check file permissions
   - Ensure multer middleware is properly configured

4. **Authentication issues:**
   - Verify JWT_SECRET is set in backend `.env`
   - Check browser localStorage for tokens
   - Ensure API_URL is correct in frontend `.env`

### Development Tips

- **Backend logs:** Check console for detailed request/response logs
- **Frontend debugging:** Open browser DevTools for React component logs
- **Database:** Use MongoDB Compass to inspect data
- **API testing:** Use Postman or similar tools to test endpoints

## 🚀 Production Deployment

### Backend
1. Set production environment variables
2. Use PM2 or similar process manager
3. Configure reverse proxy (nginx)
4. Enable HTTPS

### Frontend
1. Build the project: `npm run build`
2. Serve static files
3. Configure environment variables for production API

## 📝 Notes

- **No Google OAuth:** Removed Firebase dependency, using email/password only
- **File Storage:** Local file system (consider cloud storage for production)
- **Database:** MongoDB with Mongoose ODM
- **State Management:** React Context API
- **Styling:** Tailwind CSS with shadcn/ui components

Ready to launch! 🎉
