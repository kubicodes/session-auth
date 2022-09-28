import { Request } from "express";
import { Session, SessionData } from "express-session";

export type CustomSession = Session & Partial<SessionData> & { userId?: number };

export interface RequestWithCustomSession extends Request {
    session: CustomSession;
}

export interface CustomRequest<T> extends Request {
    body: T;
    session: CustomSession;
}
