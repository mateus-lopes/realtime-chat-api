# Realtime Chat API

A real-time chat API built with Node.js, Express, TypeScript, and Socket.io.

### 🚀 Features

- ✅ REST API with Express
- ✅ TypeScript for static typing
- ✅ ES Modules configuration
- ✅ CORS middleware configured
- ✅ Authentication route structure
- 🔄 Socket.io for real-time communication (in development)
- 🔄 MongoDB for data persistence (in development)
- 🔄 JWT for authentication (in development)
- 🔧 Tecnologias Utilizadas: **Node.js**, **Express**, **TypeScript**, **Socket.io**, **MongoDB**, **Mongoose**, **JWT**, **bcryptjs**, **CORS**, **dotenv**

### 🔧 Installation

```bash
git clone <url-do-repositorio>
cd realtime-chat-api
```

```bash
npm install
```

```bash
cp .env.example .env
```

```env
// add your configurations
MONGODB_URI=mongodb://localhost:27017/realtime-chat
PORT=5001
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=development
```

### 🚀 How to Run

#### dev
```bash
npm run dev
```

#### prod
```bash
npm run build
npm start
```
