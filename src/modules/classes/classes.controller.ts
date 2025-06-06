import { Request, Response } from "express";
import ClassModel from "./classes.model";
import { updateClassSchema, createClassSchema } from "./classes.schema";

// Only Admins should reach these routes (middleware will guard it)

interface AuthRequest extends Request {
  user?:{
    id: string,
    role: string;
  }
}

export const createClass = async (req: AuthRequest, res: Response) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }

  const validation = createClassSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ message: validation.error.issues[0].message });
  }

  const { name, classCode, level  } = validation.data;

  try {
    // Check for existing class code
    const existingCode = await ClassModel.findOne({ classCode });
    if (existingCode) return res.status(409).json({ message: "Class code already exists" });

    // Check for existing class name
    const existingName = await ClassModel.findOne({ name });
    if (existingName) return res.status(409).json({ message: "Class name already exists" });

    const newClass = await ClassModel.create({ name, classCode,level });
    res.status(201).json({ success: true, data: newClass });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};




export const getAllClasses = async (req: AuthRequest, res: Response) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }

  try {
    const classes = await ClassModel.find().populate("students");
    res.json({ success: true, data: classes });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};






export const getClassById = async (req: AuthRequest, res: Response) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }

  try {
    const found = await ClassModel.findById(req.params.id).populate("students");
    if (!found) return res.status(404).json({ message: "Class not found" });

    res.json({ success: true, data: found });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};







export const updateClass = async (req: AuthRequest, res: Response) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }

  try {
    // Validate request body against schema
    const result = updateClassSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: result.error.issues[0].message });
    }
    const value = result.data;

    const updated = await ClassModel.findByIdAndUpdate(req.params.id, value, { new: true });
    if (!updated) return res.status(404).json({ message: "Class not found" });

    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};






export const deleteClass = async (req: AuthRequest, res: Response) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }

  try {
    const deleted = await ClassModel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Class not found" });

    res.json({ success: true, message: "Class deleted" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};







export const assignStudentToClass = async (req: AuthRequest, res: Response) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Only admins can assign students' });
  }

  const { classId, studentId } = req.body;

  try {
    const classDoc = await ClassModel.findById(classId);
    if (!classDoc) return res.status(404).json({ message: 'Class not found' });

    // ✅ Prevent duplicate enrollment
    if (classDoc.students.includes(studentId)) {
      return res.status(400).json({ message: 'Student already enrolled in this class' });
    }

    classDoc.students.push(studentId);
    await classDoc.save();

    res.status(200).json({ success: true, message: 'Student assigned to class', data: classDoc });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
