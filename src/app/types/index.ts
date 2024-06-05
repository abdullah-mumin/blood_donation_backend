import { UserRole } from "@prisma/client";

export type IImage = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
};

export type IUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
} | null;
