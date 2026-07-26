import { v2 as cloudinary } from 'cloudinary';

const isProd = process.env.NODE_ENV === 'production';

if (isProd) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export { cloudinary };
export const STORAGE_MODE = isProd ? 'cloudinary' : 'local';
