import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { authConfig } from '../config/auth.config';
import { UserDocument } from '../types/types';


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


  export function verifyTokenAndAdmin(req:Request, res:Response, next: NextFunction){
    verifyToken(req,res, ()=> {
        if(req.user.email === 'nouraalmanea0@gmail.com') {
            next();
        }else{
            return res.status(403).json({message: "Not allowed Only Admin"});
        }
    });
};