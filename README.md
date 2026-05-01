🎮 Game Atlas

Game Atlas is a unified gaming platform that brings together games from multiple launchers into one place. It allows users to manage their library, discover new games, and launch installed titles seamlessly — all from a single interface.

🚀 Features
🎯 Core Features
🔗 Multi-Launcher Integration (Steam, Epic Games, Riot, etc.)
📚 Game Library Management
▶️ Launch Installed Games
⭐ Wishlist System
⏱️ Playtime Tracking
☁️ Cloud Gaming
Play browser-based games instantly
No installation required
Accessible from anywhere
🔐 Authentication & Security
JWT-based authentication
Google OAuth login
Secure API routes
User profile with avatar upload
🧑‍💻 Tech Stack
Frontend
React.js
Tailwind CSS / Modern UI
Axios (API calls)
Backend
Node.js
Express.js
Prisma ORM
Database
MongoDB
Authentication
JWT (JSON Web Tokens)
Google OAuth
📁 Project Structure
GameAtlas/
│
├── client/          # React frontend
├── server/          # Node.js backend
├── prisma/          # Database schema
├── routes/          # API routes
├── controllers/     # Business logic
├── middleware/      # Auth middleware
└── README.md
🌐 API Endpoints
POST   /api/auth/signup
POST   /api/auth/login
GET    /api/auth/google

POST   /api/library/add
POST   /api/library/install
POST   /api/library/uninstall

GET    /api/recommendations

POST   /api/playtime/update
⚙️ Installation & Setup
1️⃣ Clone the Repository
git clone https://github.com/your-username/GameAtlas.git
cd GameAtlas
2️⃣ Install Dependencies
Backend
cd server
npm install
Frontend
cd client
npm install
3️⃣ Environment Variables

Create a .env file in the server folder:

PORT=5000
DATABASE_URL=your_mongodb_url
JWT_SECRET=your_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_secret
4️⃣ Run the Project
Start Backend
cd server
npm run dev
Start Frontend
cd client
npm start
🖥️ Screens & Pages
🏠 Home / Dashboard
🔐 Login Page
📝 Signup Page (with profile upload)
📚 Library Page
❤️ Wishlist Page
🔒 Security Features
JWT Authentication
Protected Routes
Secure Password Handling
Google OAuth Integration
📌 Future Improvements
🎮 Real-time multiplayer integration
🧠 AI-based game recommendations
📱 Mobile responsive app
☁️ Advanced cloud gaming support
🤝 Contributing

Contributions are welcome!

Fork the repo
Create a new branch
Make your changes
Submit a pull request
📄 License

This project is licensed under the MIT License.

👨‍💻 Author

Gautam Arora
GitHub: https://github.com/gautamkakkar0288
