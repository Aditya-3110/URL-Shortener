# 🚀 URL Shortener 

![React](https://img.shields.io/badge/Frontend-React-blue?style=for-the-badge\&logo=react)
![Node](https://img.shields.io/badge/Backend-Node.js-green?style=for-the-badge\&logo=node.js)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen?style=for-the-badge\&logo=mongodb)
![Redis](https://img.shields.io/badge/Cache-Redis-red?style=for-the-badge\&logo=redis)


A scalable and high-performance URL shortening service designed with modern web technologies. This system converts long URLs into compact links and provides real-time analytics using an optimized caching layer.

---

🌐 Live Demo -- https://url-shortener-ashen-chi.vercel.app/

---

## ✨ Key Features

* 🔗 Instant URL shortening with unique ID generation
* ♻️ Idempotent behavior (same URL → same short link)
* ⚡ Redis-powered caching for ultra-fast redirects
* 📊 Real-time click tracking & analytics
* 🔄 Manual stats refresh support
* 📋 One-click clipboard copy
* 🎯 Clean, minimal, and responsive UI
* 🧠 Optimized backend with reduced DB hits

---

## 🧱 System Architecture

Client (React)
⬇
API Server (Node.js + Express)
⬇
Cache Layer (Redis)
⬇
Database (MongoDB Atlas)

---

## ⚙️ Tech Stack

Frontend:

* React.js
* CSS3

Backend:

* Node.js
* Express.js

Database:

* MongoDB Atlas

Caching:

* Redis

---

## 🚀 Getting Started

### Clone Repository

git clone https://github.com/Aditya-3110/URL-Shortener.git
cd URL-Shortener

---

### Backend Setup

cd backend
npm install

Create `.env` file:

PORT=3001,
MONGO_URI=your_mongodb_connection_string,
REDIS_URL=redis://127.0.0.1:6379

Run server:

node index.js

---

### Frontend Setup

cd frontend,
npm install,
npm start

---

## 📡 API Reference

### Create Short URL

POST /shorten

Body:
{
"originalUrl": "https://example.com"
}

Response:
{
"shortUrl": "http://localhost:3001/abc123"
}

---

### Redirect

GET /:shortId

Redirects to original URL and increments click count.

---

### Get Analytics

GET /stats/:shortId

Response:
{
"clicks": 10
}

---

## ⚡ Performance Optimization

* Redis caching reduces database queries for repeated requests
* MongoDB used as persistent storage for reliability
* Atomic updates ensure accurate click tracking
* Separation of concerns between routes, controllers, and services

---

## 📁 Project Structure

URL-Shortener/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── redisClient.js
│   │   └── index.js
│
├── frontend/
│   ├── src/
│   │   ├── App.js
│   │   ├── components/
│   │   └── styles/

---

## 🔮 Future Enhancements

* 🔐 Authentication & user dashboard
* ✏️ Custom short URLs
* ⏳ Expiry-based links
* 📈 Advanced analytics dashboard (charts, graphs)
* 🌍 Deployment with CI/CD (Docker, AWS, Vercel)
* 📊 Rate limiting & abuse prevention

---

## 👨‍💻 Author

Aditya Kumar Gupta

---

## ⭐ Support

If you find this project useful, consider giving it a ⭐ on GitHub!
