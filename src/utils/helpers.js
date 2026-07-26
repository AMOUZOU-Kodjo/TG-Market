import crypto from 'crypto';

export function generateOtp() {
  return crypto.randomInt(100000, 999999).toString();
}

export function generateFilename(originalName) {
  const ext = originalName.split('.').pop();
  const random = crypto.randomBytes(12).toString('hex');
  return `${Date.now()}_${random}.${ext}`;
}

export function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}
