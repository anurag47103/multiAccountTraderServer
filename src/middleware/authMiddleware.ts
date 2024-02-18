import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../controllers/jwtController';
import { DecodedToken } from "../types/types";

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7, authHeader.length); // Extract token after 'Bearer '
        const decoded: DecodedToken = verifyToken(token);
        if (decoded) {
            req.user = decoded;
            next();
        } else {
            res.sendStatus(403);
        } 
    } else {
        console.error('token not valid in url: ', req.url);
        res.sendStatus(401);
    }
};
