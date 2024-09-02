import jwt, { JwtPayload as JwtPayloadType, Secret } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import User from "../models/userModel";

interface JwtPayload {
  id: string;
}

interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
    name: string;
    email: string;
  };
}

const protect = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  let token: string | undefined;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];

    if (token) {
      try {
     
        const decoded = jwt.verify(token, process.env.JWT_SECRET as Secret) as JwtPayloadType;

        const user = await User.findById((decoded as JwtPayload).id).select("-password").lean();

        if (user) {
          req.user = user; 
      
        } else {
          res.status(401);
          throw new Error("Not authorized, user not found");
        }

        next();
      } catch (error) {
        res.status(401);
        throw new Error("Not authorized, token failed");
      }
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

export { protect };
