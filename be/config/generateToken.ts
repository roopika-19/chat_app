import jwt, { SignOptions } from "jsonwebtoken";

const generateToken = (id: string | number): string => {
  const secret = process.env.JWT_SECRET;
  
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not defined');
  }

  const options: SignOptions = {
    expiresIn: "30d",
  };

  return jwt.sign({ id }, secret, options);
};

export default generateToken;
