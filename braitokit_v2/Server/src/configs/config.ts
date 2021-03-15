import dotenv from "dotenv";

dotenv.config();

export default {
  PORT: process.env.PORT,
  DATABASE_URL: process.env.MONGODB_URI,
  SECRET_KEY: process.env.JWT_SECRET_KEY,
  SITE_URL: process.env.SITE_URL,
  AWS: {
    AWS_KEY_ID: process.env.AWS_KEY_ID,
    AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
    AWS_REGION: process.env.AWS_REGION,
    AWS_BUCKET: process.env.AWS_BUCKET
  },
  UPLOAD_FOLDER: process.env.UPLOADS_DIR,
  MODE: process.env.MODE,
  SMTP: {
    HOST: process.env.SMTP_HOST,
    PORT: process.env.SMTP_PORT,
    USER: process.env.SMTP_USER,
    PASSWORD: process.env.SMTP_PASSWORD,
  }
};
