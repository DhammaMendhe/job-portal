import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthRequest extends Request {
  userId?: string
  userRole?: string
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ success: false, message: 'Not authorized, no token' })
      return
    }

    // Extract token
    const token = authHeader.split(' ')[1]

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string, role: string }

    // Attach user info to request
    req.userId = decoded.id
    req.userRole = decoded.role

    next()
  } catch (error) {
    res.status(401).json({ success: false, message: 'Not authorized, invalid token' })
  }
}

// Middleware to restrict to employers only
export const employerOnly = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (req.userRole !== 'employer') {
    res.status(403).json({ success: false, message: 'Only employers can do this' })
    return
  }
  next()
}