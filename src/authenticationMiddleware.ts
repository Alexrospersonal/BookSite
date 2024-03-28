import { ADMIN_URI, ADMIN } from "./settings.js";
import { Request, Response, NextFunction } from "express";

export const authentication = (req: Request, res: Response, next: NextFunction) => {
    if (req.originalUrl === ADMIN_URI) {
        if (!req.get('Authorization')) {
            res.status(401).setHeader('WWW-Authenticate', 'Basic');
            next(new Error("Not Authenticated Top!"));
        } else {
            const authenticaionHeader = req.get('Authorization')!;
            const credentials = Buffer.from(authenticaionHeader.split(' ')[1], 'base64')
                .toString()
                .split(':');

            const username = credentials[0];
            const password = credentials[1];

            if (username === ADMIN.username && password === ADMIN.password) {
                res.status(200);
                next();

            } else {
                res.sendStatus(401);
                next(new Error("Not Authenticated!"));
            }
        }
    } else {
        next();
    }

}