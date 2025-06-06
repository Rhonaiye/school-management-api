import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'

const SECRET_KEY = process.env.JWT_SECRET ||  '9e7d4fcb2ba94e87b15cbe78e6a47d0d4f8d2f20d1b3401f91216fc0a9bdcb3a'

interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}


const authMiddleware = async (req: any, res: Response, next: NextFunction) => {
    const token = req.headers["authorization"];
  
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
  
    try {
      // Extract token from "Bearer <token>"
      const extractedToken = token.split(" ")[1];
  
      // Verify the token
      const decodedToken =  jwt.verify(extractedToken, SECRET_KEY);
  
      // Attach user data to request
      req.user = decodedToken;
  
      next(); // Proceed to the next middleware
    } catch (err) {
      console.error(err);
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  };
  
  export default authMiddleware;
  