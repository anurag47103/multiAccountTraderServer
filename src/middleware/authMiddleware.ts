import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../controllers/jwtController';
import { DecodedToken } from "../types/types";

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        const decoded: DecodedToken = verifyToken(token);
        if (decoded) {
            req.user = decoded; // Add the decoded token to the request so that it can be used in your route
            next();
        } else {
            res.sendStatus(403);
        }
    } else {
        res.sendStatus(401);
    }
};

export const addUserProperty = async (req: Request, res: Response, next: NextFunction) => {
    const userValue = {id: '2321', username: 'anurag'};
    req.user = userValue;

    next();
};
