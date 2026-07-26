const jwtConfig = {
  secret: process.env.JWT_SECRET || 'dev-jwt-secret',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'dev-jwt-refresh-secret',
  expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
};

export default jwtConfig;
