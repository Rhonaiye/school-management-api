// src/modules/teacher/teacher.model.ts
import { Schema, model, Types } from "mongoose";

export interface ITeacher {
  user: Types.ObjectId;       // Reference to User
  fullName: string;
  subject: string;
  hireDate: Date;
  classAssigned?: Types.ObjectId[]; // Optional reference to Class
}

const teacherSchema = new Schema<ITeacher>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    fullName: { type: String, required: true },
    subject: { type: String, required: true },
    hireDate: { type: Date, default: Date.now },
    classAssigned: [{ type: Schema.Types.ObjectId, ref: "Class" }],
  },
  { timestamps: true }
);

const Teacher = model<ITeacher>("Teacher", teacherSchema);
export default Teacher;
