import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { authConfig } from '../config/auth.config';


export const verifyToken = (res: Response, req: Request, next: NextFunction) => {
    const token = req.headers['authorization'];
    if (!token){
        return res.status(403).json({message: 'No token, access denied'})
    }
    next();

}