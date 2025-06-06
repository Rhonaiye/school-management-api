import { Types, Schema } from "mongoose";
import mongoose from "mongoose";

// Interfaces
interface ITestScore {
    label: string; // e.g., "1st CA", "2nd CA"
    score: number;
}

interface IGrade {
    student: Types.ObjectId;
    subject: string;
    classId: Types.ObjectId;
    term: "First" | "Second" | "Third";
    testScores: ITestScore[];
    examScore: number;
    totalScore: number;
    grade: string;
    gradingMode: "auto" | "manual";
    createdAt?: Date;
    updatedAt?: Date;
}

// Schema
const gradeSchema = new Schema<IGrade>(
    {
        student: { 
            type: Schema.Types.ObjectId, 
            ref: "Student", 
            required: true 
        },
        subject: { 
            type: String, 
            required: true 
        },
        classId: { 
            type: Schema.Types.ObjectId, 
            ref: "Class", 
            required: true 
        },
        term: { 
            type: String, 
            enum: ["First", "Second", "Third"], 
            required: true 
        },
        testScores: [{
            label: { type: String, required: true },
            score: { type: Number, required: true },
        }],
        examScore: { 
            type: Number, 
            required: true 
        },
        totalScore: { 
            type: Number, 
            required: true 
        },
        grade: { 
            type: String, 
            required: true 
        },
        gradingMode: { 
            type: String, 
            enum: ["auto", "manual"], 
            default: "auto" 
        },
    },
    { timestamps: true }
);

export const calculateGrade = (total: number): string => {
    if (total >= 70) return "A";
    if (total >= 60) return "B";
    if (total >= 50) return "C";
    if (total >= 45) return "D";
    if (total >= 40) return "E";
    return "F";
  };
  

// Model
const Grade = mongoose.model<IGrade>("Grade", gradeSchema);

export default Grade;