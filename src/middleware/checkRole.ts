import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export function checkRole(allowedRoles: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.headers.authorization;
        const token = authHeader?.split(" ")[1] || authHeader;

        if (!token) return res.status(401).json({ error: "Acesso negado" });

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { role: string };

            if (!allowedRoles.includes(decoded.role)) {
                return res.status(403).json({ error: "Acesso Negado" });
            }

            return next();
        } catch (err) {
            return res.status(401).json({ error: "Token inválido" });
        }
    };
}