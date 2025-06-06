import { Request, Response } from 'express';
import Grade from './grades.model';
import { calculateGrade } from './grades.model';


interface AuthRequest extends Request {
  user?:{
    id: string,
    role: string;
  }
}

export const createGradeController = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== "teacher" && req.user?.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const {
      student,
      subject,
      classId,
      term,
      testScores = [],
      examScore,
      gradingMode = "auto",
      grade,
    } = req.body;

    let total = 0;

    // Sum test scores
    for (const t of testScores) {
      total += t.score;
    }

    // If examScore is provided, add it to total
    if (typeof examScore === "number") {
      total += examScore;
    }

    // Determine grade
    let finalGrade: string | undefined = undefined;

    if (gradingMode === "auto" && typeof examScore === "number") {
      finalGrade = calculateGrade(total);
    } else if (gradingMode === "manual") {
      finalGrade = grade;
    }

    const newGrade = await Grade.create({
      student,
      subject,
      classId,
      term,
      testScores,
      examScore,
      totalScore: typeof examScore === "number" ? total : undefined,
      gradingMode,
      grade: finalGrade,
    });

    res.status(201).json({ success: true, data: newGrade });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to create grade",
      error: error.message,
    });
  }
};




export const getStudentGrades = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const grades = await Grade.find({ student: studentId }).populate("classId");
    res.status(200).json({ success: true, data: grades });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch grades", error: error.message });
  }
};



export const getClassGrades = async (req: Request, res: Response) => {
  try {
    const { classId } = req.params;
    const grades = await Grade.find({ classId }).populate("student");
    res.status(200).json({ success: true, data: grades });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch class grades", error: error.message });
  }
};




export const filterGrades = async (req: Request, res: Response) => {
  try {
    const { term, subject } = req.query;
    const query: any = {};
    if (term) query.term = term;
    if (subject) query.subject = subject;

    const grades = await Grade.find(query);
    res.status(200).json({ success: true, data: grades });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to filter grades", error: error.message });
  }
};
