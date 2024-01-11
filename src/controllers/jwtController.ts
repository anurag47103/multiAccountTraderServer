import jwt from 'jsonwebtoken';
import { User, DecodedToken } from '../types/types';
import config from "../config/config";

const secretKey = config.JWT_SECRET || 'your_secret_key'; // Ensure you have a secret key

export const generateToken = (user: User): string => {
    return jwt.sign({ user_id: user.user_id, user_name: user.user_name },
        secretKey,
        { expiresIn: '24h' });
};

export const verifyToken = (token: string): DecodedToken | null => {
    try {
        return jwt.verify(token, secretKey) as DecodedToken;
    } catch (error) {
        return null;
    }
};
