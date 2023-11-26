import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { authConfig } from '../config/auth.config';


export function verifyToken(req: Request, res:Response, next: NextFunction) {
    const authenticationToken = req.headers.authorization;
    if (authenticationToken) {
      const token = authenticationToken;
      try {
        const decodedPayload = jwt.verify(token, authConfig.jwt.accessToken);
        console.log(decodedPayload)
        next();
      } catch (error) {
        res.status(401).json({ message: "Invalid token, access denied" });
      }
    } else {
      res.status(401).json({ message: "No token, access denied" });
    }
  };

  export function verifyAdmin(req:Request, res:Response, next: NextFunction){
    
  }