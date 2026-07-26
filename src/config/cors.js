const corsConfig = {
  origin: (origin, callback) => {
    const allowed = (process.env.CORS_ORIGINS || '').split(',').map(s => s.trim());
    if (!origin || allowed.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

export default corsConfig;
