const corsConfig = {
  origin: (origin, callback) => {
    const allowed = (process.env.CORS_ORIGINS || '')
      .split(',')
      .map(s => s.trim());
    const isPreview = origin && origin.endsWith('.ak-market.pages.dev');
    const isLocalhost = origin && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
    if (!origin || allowed.includes(origin) || isPreview || isLocalhost) {
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
