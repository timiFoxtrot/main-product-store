import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';


dotenv.config();

export class JWT {
  private static secret: jwt.Secret = process.env.JWT_SECRET as string

  public static encode<T>(payload: Partial<T>, options?: Partial<jwt.SignOptions>): string {
    console.log('secret', this.secret, '', process.env.JWT_SECRET);
    try {
      const token = jwt.sign(payload, this.secret, { expiresIn: process.env.JWT_EXPIRY_TIME as any || '30d', ...options });
      return token;
    } catch (error) {
      throw error;
    }
  }

  public static decode(token: string): jwt.JwtPayload {
    try {
      const decoded = jwt.verify(token, this.secret);
      return decoded as jwt.JwtPayload;
    } catch (error) {
      throw error;
    }
  }
}
