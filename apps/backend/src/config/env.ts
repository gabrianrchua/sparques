import 'dotenv/config';

export const ACCESS_TOKEN_SECRET =
  process.env.ACCESS_TOKEN_SECRET ||
  process.env.JWT_SECRET ||
  'mysecretdontuse';
export const ACCESS_TOKEN_TTL_MINUTES = Number(
  process.env.ACCESS_TOKEN_TTL_MINUTES || 15,
);
export const REFRESH_SESSION_TTL_DAYS = Number(
  process.env.REFRESH_SESSION_TTL_DAYS || 90,
);
export const COOKIE_SECURE = process.env.NODE_ENV === 'production';
export const MONGO_URI =
  process.env.MONGO_URI ||
  'mongodb://mongoadmin:secret@localhost:27017/sparquesdb?authSource=admin';
export const PORT = process.env.PORT || 8080;
