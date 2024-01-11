// custom.d.ts

declare namespace Express {
    export interface Request {
        user?: {
            id: string;
            username: string;
            // other properties
        };
    }
}
