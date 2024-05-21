import 'express';

declare module 'express-session' {
    interface SessionData {
        user?: {
            username: string;
            email: string;
        };
    }
}

declare module 'express' {
    interface Request {
        session: SessionData;
    }
}