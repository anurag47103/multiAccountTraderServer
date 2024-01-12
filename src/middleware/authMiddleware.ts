import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../controllers/jwtController';
import { DecodedToken } from "../types/types";

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies['token'];
    console.log('jwttoken from cookie : ', token)
    if (token) {
        const decoded: DecodedToken = verifyToken(token);
        if (decoded) {
            console.log('token verified', decoded);
            req.user = decoded; // Add the decoded token to the request so that it can be used in your route
            next();
        } else {
            res.sendStatus(403);
        }
    } else {
        res.sendStatus(401);
    }
};
