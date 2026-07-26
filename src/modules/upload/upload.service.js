import sharp from 'sharp';
import { writeFile, mkdir, unlink } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateFilename } from '../../utils/helpers.js';
import { cloudinary, STORAGE_MODE } from '../../config/storage.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS_ROOT = path.resolve(__dirname, '../../../uploads');

function buildStoragePath(userId) {
  const now = new Date();
  const year = String(now.getFullYear());
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return path.join(UPLOADS_ROOT, 'listings', String(userId), year, month);
}

async function processImage(buffer, options = {}) {
  let pipeline = sharp(buffer);
  if (options.width) {
    pipeline = pipeline.resize({ width: options.width, withoutEnlargement: true });
  }
  return pipeline.webp({ quality: 85 }).toBuffer();
}

async function saveLocal(buffer, dir, filename) {
  await mkdir(dir, { recursive: true });
  const filePath = path.join(dir, filename);
  await writeFile(filePath, buffer);
  return filePath;
}

function toRelative(absPath) {
  return path.relative(UPLOADS_ROOT, absPath).replace(/\\/g, '/');
}

async function uploadToCloudinary(buffer, folder) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image', format: 'webp' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
}

const BASE_URL = process.env.FRONTEND_URL || process.env.RAILWAY_PUBLIC_DOMAIN
  ? `https://tg-market-api-production.up.railway.app`
  : 'http://localhost:3000';

export async function uploadImage(file, userId) {
  const baseName = generateFilename(file.originalname);

  const [originalBuffer, mediumBuffer, thumbBuffer] = await Promise.all([
    processImage(file.buffer),
    processImage(file.buffer, { width: 800 }),
    processImage(file.buffer, { width: 300 }),
  ]);

  if (STORAGE_MODE === 'cloudinary') {
    const folder = `tg-market/listings/${userId}`;
    const [orig, med, thumb] = await Promise.all([
      uploadToCloudinary(originalBuffer, folder),
      uploadToCloudinary(mediumBuffer, folder),
      uploadToCloudinary(thumbBuffer, folder),
    ]);
    return {
      url: orig.secure_url,
      medium: med.secure_url,
      thumbnail: thumb.secure_url,
      key: orig.public_id,
    };
  }

  const dir = buildStoragePath(userId);
  const originalFilename = `original_${baseName}`;
  const mediumFilename = `medium_${baseName}`;
  const thumbFilename = `thumb_${baseName}`;

  await Promise.all([
    saveLocal(originalBuffer, dir, originalFilename),
    saveLocal(mediumBuffer, dir, mediumFilename),
    saveLocal(thumbBuffer, dir, thumbFilename),
  ]);

  const relativeDir = toRelative(dir);

  return {
    url: `${BASE_URL}/uploads/${relativeDir}/${originalFilename}`,
    medium: `${BASE_URL}/uploads/${relativeDir}/${mediumFilename}`,
    thumbnail: `${BASE_URL}/uploads/${relativeDir}/${thumbFilename}`,
    key: path.join(relativeDir, originalFilename),
  };
}

export async function uploadImages(files, userId) {
  return Promise.all(files.map((file) => uploadImage(file, userId)));
}

export async function deleteFile(key) {
  if (STORAGE_MODE === 'cloudinary') {
    await cloudinary.uploader.destroy(key);
    return { message: 'Fichier supprimé avec succès' };
  }

  const filePath = path.join(UPLOADS_ROOT, key);
  const variants = [
    filePath,
    filePath.replace('original_', 'medium_'),
    filePath.replace('original_', 'thumb_'),
  ];

  await Promise.all(variants.map((p) => unlink(p).catch(() => {})));
  return { message: 'Fichier supprimé avec succès' };
}
