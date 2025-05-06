
# FXGlobal Backend

Welcome to the official backend repository for **FXGlobal**, a multi-level marketing (MLM) platform providing seamless user onboarding, transaction handling, and reward distribution. This project powers the backend for both the FXGlobal web frontend and the mobile admin application.

## 🌐 Live URLs

- **Frontend**: [https://fxglobal.ltd](https://fxglobal.ltd)
- **Backend API**: [https://fxglobal-backend.vercel.app](https://fxglobal-backend.vercel.app)
- **Admin Android App**: [FXGlobal Admin App (GitHub)](https://github.com/Aryann001/fxglobal-admin-android-APP)

---

## 📌 Features

- 🔐 **User Authentication & Authorization**
- 💸 **Deposit & Withdrawal System**
- 🪙 **Token Distribution & Tracking**
- 🧑‍🤝‍🧑 **Multi-Level Referral Structure**
- 📊 **Wallet Balances, ROI Calculation**
- 📱 **Admin Mobile App Support for Approvals**
- 🚀 **Fast & Scalable REST API**

---

## 📁 Project Structure

```
fxglobal-backend/
├── controllers/       # API logic
├── models/            # MongoDB schemas
├── routes/            # API endpoints
├── middlewares/       # Auth & validation
├── utils/             # Helper functions
├── config/            # Environment & DB config
├── app.js             # Middleware
├── server.js          # Entry point
└── package.json
```

---

## ⚙️ Tech Stack

- **Node.js** with **Express.js**
- **MongoDB** with **Mongoose**
- **JWT** for secure authentication
- **Vercel** for deployment
- **RESTful API** architecture

---

## 🔐 Admin Panel App

FXGlobal includes a dedicated Android admin mobile app for:

- ✅ Approving deposits and withdrawals
- 📤 Sending tokens to users
- 📋 Viewing pending and completed transactions

📦 [Source Code](https://github.com/Aryann001/fxglobal-admin-android-APP)

---

## 🛠️ Getting Started Locally

### Prerequisites

- Node.js v16+
- MongoDB URI
- Vercel CLI (optional for deployment)

### Installation

```bash
git clone https://github.com/Aryann001/fxglobal-backend.git
cd fxglobal-backend
npm install
```

### Environment Variables

Create a `.env` file and include the following:

```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
```

### Run the Server

```bash
npm start
```

---

## 📬 API Endpoints

> Base URL: `https://fxglobal-backend.vercel.app`

| Method | Endpoint               | Description                   |
|--------|------------------------|-------------------------------|
| POST   | `/api/v1/register`   | Register new user             |
| POST   | `/api/v1/login`      | Login existing user           |

More API documentation coming soon.

---

## 🚀 Deployment

This project is continuously deployed via [Vercel](https://vercel.com/).

---

## 🤝 Contributing

Contributions are welcome! Open an issue or create a pull request with improvements, bug fixes, or features.

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 👨‍💻 Author

- **Aryan Baghel**  
  GitHub: [@Aryann001](https://github.com/Aryann001)
