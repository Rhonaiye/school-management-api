import { Request, Response } from 'express';
import Student from './students.model';
import User from '../auth/auth.model';
import bcrypt from 'bcrypt';
import ClassModel from '../classes/classes.model';


/**
 * Controller to register a new student and create a user account for them.
 * 
 * @param req - Express request object containing student details.
 * @param res - Express response object to send the result.
 */


interface AuthRequest extends Request {
  user?:{
    id: string,
    role: string;
  }
}


export const registerStudentController = async (req: Request, res: Response) => {
  try {
    const {
      fullName,
      studentId,
      classId,
      dateOfBirth,
      guardianContact,
      address,
      email,
      password, // required to create user
    } = req.body;

    // 1. Create User account with role "student"
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      role: "student",
    });

    // 2. Create Student record and link to user
    const student = await Student.create({
      fullName,
      studentId,
      classId,
      dateOfBirth,
      guardianContact,
      address,
      user: newUser._id,
    });

    res.status(201).json({
      success: true,
      message: "Student and user created successfully",
      data: student,
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: "Failed to create student",
      error: error.message,
    });
  }
};



/**
 * Controller to get student details by Name.
 * 
 * @param req - Express request object containing student Name.
 * @param res - Express response object to send the result.
 */





export const getStudentByNameController = async (req: Request, res: Response) => {
  try {
    const { fullName } = req.params;

    const student = await Student.findOne({
      fullName: { $regex: fullName, $options: "i" }  // Case-insensitive, partial match
    }).populate("user", "-password");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      data: student,
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error fetching student",
      error: error.message,
    });
  }
};



export const getStudentProfileController = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const student = await Student.findOne({ user: req.user.id })
      .populate("classId");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found",
      });
    }

    res.status(200).json({
      success: true,
      data: student,
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error fetching student profile",
      error: error.message,
    });
  }
};




export const promoteStudentsController = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ success: false, message: "Only admin can promote students" });
    }

    const { fromClassId } = req.params;

    const fromClass = await ClassModel.findById(fromClassId).populate('students');
    if (!fromClass) return res.status(404).json({ message: "Source class not found" });

    const toClass = await ClassModel.findOne({ level: fromClass.level + 1 });
    if (!toClass) return res.status(404).json({ message: "Next level class not found" });

    // Promote each student
    const updatedStudents = await Promise.all(
      fromClass.students.map(async (studentId: any) => {
        const student = await Student.findById(studentId);
        if (!student) return null;

        if (student.classId?.toString() === fromClassId) {
          student.classId = toClass._id;
          await student.save();

          // Add to new class
          if (!toClass.students.includes(student._id)) {
            toClass.students.push(student._id);
          }
        }

        return student;
      })
    );

    // Save new class changes
    await toClass.save();

    res.status(200).json({
      success: true,
      message: `Promoted ${updatedStudents.length} students from ${fromClass.name} to ${toClass.name}`,
    });

  } catch (error: any) {
    res.status(500).json({ success: false, message: "Promotion failed", error: error.message });
  }
};




export const addStudentsToClassController = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ success: false, message: "Only admin can add students to class" });
    }

    const { classId } = req.params;
    const { studentIds } = req.body;

    const targetClass = await ClassModel.findById(classId);
    if (!targetClass) {
      return res.status(404).json({ success: false, message: "Class not found" });
    }

    const updatedStudents = await Promise.all(
      studentIds.map(async (studentId: string) => {
        const student = await Student.findById(studentId);
        if (!student) return null;

        student.classId = targetClass._id;
        await student.save();

        if (!targetClass.students.includes(student._id)) {
          targetClass.students.push(student._id);
        }

        return student;
      })
    );

    await targetClass.save();

    res.status(200).json({
      success: true,
      message: `Added ${updatedStudents.filter(s => s).length} students to ${targetClass.name}`,
      data: updatedStudents.filter(s => s)
    });

  } catch (error: any) {
    res.status(500).json({ success: false, message: "Failed to add students", error: error.message });
  }
};



export const addStudentToClassController = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ success: false, message: "Only admin can add student to class" });
    }

    const { classId } = req.params;
    const { studentId } = req.body;

    const targetClass = await ClassModel.findById(classId);
    if (!targetClass) {
      return res.status(404).json({ success: false, message: "Class not found" });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    student.classId = targetClass._id;
    await student.save();

    if (!targetClass.students.includes(student._id)) {
      targetClass.students.push(student._id);
    }

    await targetClass.save();

    res.status(200).json({
      success: true,
      message: `Added student ${student.fullName} to ${targetClass.name}`,
      data: student
    });

  } catch (error: any) {
    res.status(500).json({ success: false, message: "Failed to add student", error: error.message });
  }
};
