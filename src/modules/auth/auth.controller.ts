import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { registerSchema, loginSchema } from "./auth.schema";
import jwt from "jsonwebtoken";
import User from "./auth.model";
import Student from "../students/students.model";

interface AuthRequest extends Request{
  user?: {
    id: string;
    role: string;
  }
}

export const registerTeacherController = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email and password are required" });
  }
  
  const validation = registerSchema.safeParse({ name, email, password });
  if (!validation.success) {
    return res.status(400).json({ message: "Invalid input", errors: validation.error });
  }
  
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed, role: "teacher" });
  res.status(201).json({ message: "Teacher registered", user: { id: user._id, email: user.email } });
};





export const registerAdminController = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email and password are required" });
  }

  const validation = registerSchema.safeParse({body: { name, email, password }});
  if (!validation.success) {
    return res.status(400).json({ message: "Invalid input", errors: validation.error });
  }
  
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed, role: "admin" });
  res.status(201).json({ message: "Admin registered", user: { id: user._id, email: user.email } });
};



export const loginController = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email and password are required" });

  const validation = loginSchema.safeParse({ body: { email, password } });

  if (!validation.success) {
    return res.status(400).json({ message: "Invalid input", errors: validation.error });
  }
  
  const user = await User.findOne({ email });
  if (!user || !user.password) return res.status(400).json({ message: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: "1d" });
  res.json({ token });
};



export const getUserProfileController = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const userRole = req.user?.role;
  
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = await User.findById(userId).select("-password");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (userRole === 'student') {
    const studentDetails = await Student.findOne({ user: userId });
    if (!studentDetails) {
     return res.status(404).json({ message: "Student details not found" });
    }
    return res.json({ 
     user: { id: user._id, email: user.email, role: user.role },
     student: studentDetails
    });
  }

  res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });
}


export const updateUserProfileController = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const userRole = req.user?.role;
  const { name, email } = req.body;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (userRole !== 'admin') {
    return res.status(403).json({ message: "Only admins can edit user profiles" });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (name) user.name = name;
  if (email) user.email = email;

  await user.save();
  
  res.json({ message: "Profile updated", user: { id: user._id, name: user.name, email: user.email, role: user.role } });
};