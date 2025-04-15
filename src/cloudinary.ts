// cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';
import { env } from './env'; // Certifique-se de que seu arquivo env.ts exporta as variáveis de ambiente

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export default cloudinary;