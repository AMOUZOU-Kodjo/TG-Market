export function errorHandler(err, req, res, _next) {
  console.error('Error:', err.message);

  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ error: 'Fichier trop volumineux (max 5 Mo)' });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ error: 'Champ de fichier inattendu' });
    }
  }

  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ error: 'Origine non autorisée' });
  }

  const status = err.status || err.statusCode || 500;
  const message = err.message;

  res.status(status).json({ error: message });
}
