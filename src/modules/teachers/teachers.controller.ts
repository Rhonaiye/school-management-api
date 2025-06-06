import { Request, Response } from 'express';
import User from '../auth/auth.model';
import Teacher from './teachers.model';
import ClassModel from '../classes/classes.model';
import bcrypt from 'bcrypt';

export const exampleController = (req: Request, res: Response) => {
  res.send('Example endpoint');
};



export const registerTeacherController = async (req: Request, res: Response) => {
  try {
    const {
      fullName,
      subject,
      email,
      password, // required to create user
    } = req.body;

    // 1. Create User account with role "student"
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      role: "teacher",
    });

    // 2. Create Student record and link to user
    const student = await Teacher.create({
      fullName,
      subject,
      user: newUser._id,
    });

    res.status(201).json({
      success: true,
      message: "Teacher and user created successfully",
      data: student,
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: "Failed to create teacher",
      error: error.message,
    });
  }
};


interface AuthRequest extends Request {
  user?: {
    role: string;
    id: string;
  };
}



export const getTeachersController = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Only admin can access this resource",
      });
    }

    const teachers = await Teacher.find().populate('user', 'email');
    res.status(200).json({
      success: true,
      data: teachers,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: "Failed to fetch teachers",
      error: error.message,
    });
  }
};

export const updateTeacherController = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Only admin can update teachers",
      });
    }

    const { id } = req.params;
    const { fullName, subject } = req.body;
    
    const updatedTeacher = await Teacher.findByIdAndUpdate(
      id,
      { fullName, subject },
      { new: true }
    );

    if (!updatedTeacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    res.status(200).json({
      success: true,
      data: updatedTeacher,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: "Failed to update teacher",
      error: error.message,
    });
  }
};

export const deleteTeacherController = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Only admin can delete teachers",
      });
    }

    const { id } = req.params;
    const teacher = await Teacher.findById(id);

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    await User.findByIdAndDelete(teacher.user);
    await Teacher.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Teacher deleted successfully",
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: "Failed to delete teacher",
      error: error.message,
    });
  }
};



export const assignTeacherToClassController = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Only admin can assign teachers to classes"
      });
    }

    const { teacherId, classId } = req.params;

    // Fetch class and teacher by ID
    const classDoc = await ClassModel.findById(classId);
    const teacher = await Teacher.findById(teacherId);

    if (!classDoc) {
      return res.status(404).json({ success: false, message: "Class not found" });
    }

    if (!teacher) {
      return res.status(404).json({ success: false, message: "Teacher not found" });
    }

    // Prevent duplicate assignment
    const alreadyAssignedToClass = teacher.classAssigned?.includes(classDoc._id);
    const alreadyHasTeacher = classDoc.teachers?.includes(teacher._id);

    if (!alreadyAssignedToClass) {
      teacher.classAssigned?.push(classDoc._id);
      await teacher.save();
    }

    if (!alreadyHasTeacher) {
      classDoc.teachers.push(teacher._id);
      await classDoc.save();
    }

    res.status(200).json({
      success: true,
      message: "Teacher assigned to class successfully",
      data: teacher,
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: "Failed to assign teacher to class",
      error: error.message
    });
  }
};
