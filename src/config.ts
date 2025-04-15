import { v2 as cloudinary } from 'cloudinary';
import { env } from './env'; // Certifique-se de que seu env.ts carrega as variáveis de ambiente

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export { cloudinary };