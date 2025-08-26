
import jwt from "jsonwebtoken"
import { Request, Response, NextFunction } from "express";
import { userPayload } from "../types/general";
// import { PrismaClient } from "@prisma/client";

declare module "express-serve-static-core" {
    interface Request {
        user?: userPayload
    }
}

// const prisma = new PrismaClient()



export async function authMiddleware(req: Request, res: Response, next: NextFunction) {

    const authHeader = req.headers.authorization
    if (!authHeader) return res.status(401).json({ success: false, error: "Unauthorized" });

    const token = authHeader.split(" ")[1];

    if (!token) return res.status(401).json({ success: false, error: "Token not provided" });



    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as userPayload
        // const user = await prisma.user.findUnique({
        //     where: { email: decoded.email },
        // });

        // if (!user) {
        //     return res.status(401).json({ success: false, error: "User not found" });
        // }
        req.user = decoded
        next()
    } catch (error) {
        res.status(403).json({ status: false, error: "Forbidden" });
    }

}