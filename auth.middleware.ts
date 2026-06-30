import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "./db";

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    name: string | null;
    role: "USER" | "ADMIN";
  };
}

export async function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or invalid token" });
  }

  const token = header.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Missing token" });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({ message: "JWT secret not configured" });
  }

  let payload: { userId: number };
  try {
    payload = jwt.verify(token, secret) as unknown as { userId: number };
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, email: true, name: true, role: true },
  });

  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }

  req.user = user;
  next();
}
