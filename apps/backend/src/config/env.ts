import 'dotenv/config';

export const JWT_SECRET = process.env.JWT_SECRET || 'mysecretdontuse';
export const MONGO_URI =
  process.env.MONGO_URI ||
  'mongodb://mongoadmin:secret@localhost:27017/sparquesdb?authSource=admin';
