import { JwtPayload } from 'jsonwebtoken';

export interface SparquesJwtPayload extends JwtPayload {
  username: string;
}
