<div align="center">

# 4URL.site 🔗
[![Live Demo](https://img.shields.io/badge/Live-4URL.site-blue?style=for-the-badge)](https://4url.site)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github)](https://github.com/binelbpe/4URLShortner.git)

A modern URL shortening service with advanced analytics and tracking capabilities.

</div>

## ✨ Features

- 🔗 Quick URL shortening
- 📊 Comprehensive click analytics
- 📱 Device and browser tracking
- 🔒 Secure user authentication
- 📈 Real-time statistics dashboard
- 🎯 User-friendly interface

## 🚀 Tech Stack

### Frontend
- React 18
- Redux Toolkit for state management
- Redux Persist for local storage
- React Router for navigation
- Tailwind CSS for styling
- Axios for API requests

### Backend
- Node.js & Express
- MongoDB with Mongoose
- JWT authentication
- Express Validator
- Express UserAgent for analytics
- CORS enabled
- Environment variables support

## 📝 Prerequisites

Before running this project, make sure you have:

- Node.js (v14 or higher)
- MongoDB database
- npm or yarn package manager

## 🛠️ Installation

1. **Clone the repository**
```bash
git clone https://github.com/binelbpe/4URLShortner.git
cd 4URLShortner
```

2. **Backend Setup**
```bash
cd backend
npm install

# Create .env file with:
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
REFRESH_SECRET=your_refresh_secret
CORS_ORIGIN=http://localhost:3000
```

3. **Frontend Setup**
```bash
cd frontend
npm install

# Create .env file with:
REACT_APP_API_URL=http://localhost:5000
REACT_APP_REDIRECT_URL=http://localhost:5000
```

## 🚦 Running the Project

1. **Start Backend Server**
```bash
cd backend
npm run dev
```

2. **Start Frontend Development Server**
```bash
cd frontend
npm start
```

The application will be available at `http://localhost:3000`

## 📦 Project Structure

```
4URLShortner/
├── backend/
│   ├── node_modules/
│   ├── app.js
│   ├── package.json
│   └── .env
│
└── frontend/
    ├── node_modules/
    ├── public/
    ├── src/
    ├── package.json
    └── .env
```

## 🔐 Environment Variables

### Backend
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
REFRESH_SECRET=your_refresh_secret
CORS_ORIGIN=http://localhost:3000
```

### Frontend
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_REDIRECT_URL=http://localhost:5000
```

## 🌟 Key Features Explained

### URL Shortening
- Generate short, unique URLs using `shortid`
- Custom URL paths support
- QR code generation for shortened URLs

### Analytics Dashboard
- Track total clicks
- Monitor device types
- Browser analytics
- Geographic data
- Time-based statistics

### Security
- JWT-based authentication
- Secure password hashing with bcrypt
- Protected API endpoints
- Input validation and sanitization

## 📱 API Endpoints

```
POST   /api/auth/register    # User registration
POST   /api/auth/login       # User login
POST   /api/urls/shorten    # Create short URL
GET    /api/urls            # Get user's URLs
GET    /api/urls/:id/stats  # Get URL statistics
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 👨‍💻 Author

Created by [binelbpe](https://github.com/binelbpe)
