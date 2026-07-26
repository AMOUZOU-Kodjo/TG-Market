import 'dotenv/config';
import { createServer } from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import { setupSocketIO } from './sockets/socketHandler.js';

const PORT = process.env.PORT || 3000;
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: (process.env.CORS_ORIGINS || '').split(',').map(s => s.trim()),
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
  pingTimeout: 20000,
  pingInterval: 25000,
});

setupSocketIO(io);

server.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════=============================╗
  ║        TG-Market API v1.0.0                                       ║
  ║  http://localhost:${PORT}                                         ║
  ║  Environment: ${process.env.NODE_ENV || 'development'}            ║
  ╚═══════════════════════════════════════============================╝
  `);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  server.close(() => process.exit(1));
});

export { io };
