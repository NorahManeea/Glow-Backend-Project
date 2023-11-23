import { NextFunction, Request, Response } from "express";
import zod from 'zod'
import ApiError from "../errors/ApiError";

export function validateUser (req: Request, res: Response, next: NextFunction){
    const schema = {
        email: zod.string().email(),
        password: zod.string().min(8)
    }
}