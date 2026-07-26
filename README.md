# Perplexity AI Clone (Answer Engine)

A production-grade, full-stack AI-powered search and answer engine inspired by Perplexity AI. This application features conversational AI, web search with citations, multi-model support, secure authentication, and a premium glassmorphic UI.

## Architecture

This project is built using a decoupled client-server architecture:
- **Frontend**: React 18, Vite, Redux Toolkit, Tailwind CSS v3, Framer Motion
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JWT Auth
- **AI Layer**: LangChain ecosystem (`@langchain/core`, `groq`, `google-genai`, `mistralai`)
- **Web Search**: Tavily API

```text
Client (React/Redux) ↔ Express REST API ↔ MongoDB
                                      ↔ AI Models (Groq, Gemini, Mistral)
                                      ↔ Web Search (Tavily)
```

## Prerequisites
- Node.js (v18+)
- MongoDB Atlas cluster (or local MongoDB server)
- API Keys for AI and Search providers (Groq, Gemini, Mistral, Tavily)

## Installation

1. Clone the repository and navigate into it.
2. The project contains two separate folders: `frontend` and `backend`.

## Environment Setup

### Backend
1. Navigate to the backend directory: `cd backend`
2. Copy the example env file: `cp .env.example .env` (or duplicate it manually)
3. Fill in the `.env` file with your credentials:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/perplexity-clone
JWT_SECRET=your_super_secret_string
JWT_EXPIRES_IN=7d
GROQ_API_KEY=your_groq_key
GOOGLE_API_KEY=your_gemini_key
MISTRAL_API_KEY=your_mistral_key
TAVILY_API_KEY=your_tavily_key
CLIENT_URL=http://localhost:5173
```

### Frontend
1. Navigate to the frontend directory: `cd frontend`
2. Copy the example env file: `cp .env.example .env`
3. Verify the API URL:
```env
VITE_API_URL=http://localhost:5000/api
```

## Startup Instructions

### 1. Start the Backend (API Server)
```bash
cd backend
npm install
npm run dev
```
The backend will run on `http://localhost:5000`.

### 2. Start the Frontend (Vite Server)
Open a new terminal window.
```bash
cd frontend
npm install
npm run dev
```
The frontend will be available at `http://localhost:5173`.

## API Documentation

### Auth
- `POST /api/auth/register` - Body: `{ username, email, password }`
- `POST /api/auth/login` - Body: `{ email, password }`
- `GET /api/auth/me` - Requires Bearer Token
- `POST /api/auth/logout` - Clears HttpOnly cookie

### Chats
- `GET /api/chats` - Get all user chats (Requires Token)
- `GET /api/chats/:chatId` - Get specific chat
- `POST /api/chats` - Create empty chat
- `DELETE /api/chats/:chatId` - Delete chat and associated messages

### Messages
- `POST /api/chats/message` - Send message. Body: `{ message, chatId (optional), modelChoice, webSearch }`
- `GET /api/chats/:chatId/messages` - Get all messages for a chat

## Troubleshooting
- **CORS Errors**: Ensure `CLIENT_URL` in the backend `.env` perfectly matches the URL Vite is running on (including the protocol, e.g., `http://localhost:5173` without a trailing slash).
- **MongoDB Timeout**: If you cannot connect to MongoDB, ensure your IP address is whitelisted in the MongoDB Atlas Network Access settings.
- **Missing AI Key**: The backend will gracefully fall back to a "demo mode" string if a requested AI model's API key is missing. Ensure your keys are valid.

## Deployment Instructions

### Database
1. Create a production cluster on **MongoDB Atlas**.
2. Allow network access from anywhere (`0.0.0.0/0`) since serverless backends have dynamic IPs.

### Backend (e.g., Render, Railway, Heroku)
1. Set the Build Command to `npm install` inside the `backend` folder.
2. Set the Start Command to `npm start`.
3. Add ALL environment variables from your `.env` to the hosting provider's dashboard.
4. IMPORTANT: Update `CLIENT_URL` to match your deployed frontend URL.

### Frontend (e.g., Vercel, Netlify)
1. Set the Root Directory to `frontend`.
2. Set the Build Command to `npm run build`.
3. Set the Output Directory to `dist`.
4. Add the `VITE_API_URL` environment variable pointing to your deployed backend (e.g., `https://my-backend.onrender.com/api`).
