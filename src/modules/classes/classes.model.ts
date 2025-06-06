import { Schema, model, Types } from "mongoose";

export interface IClass {
  name: string;
  classCode: string;
  level: number  // 1 means Jss1, 2 means Jss2, etc.
  students: Types.ObjectId[];
  teachers: Types.ObjectId[];
}

const classSchema = new Schema<IClass>(
  {
    name: { type: String, required: true },
    classCode: { type: String, required: true, unique: true },
    level: { type: Number, required: true },
    students: [{ type: Schema.Types.ObjectId, ref: "Student" }],
    teachers: [{ type: Schema.Types.ObjectId, ref: "Teacher" }],
  },
  { timestamps: true }
);

const ClassModel = model<IClass>("Class", classSchema);
export default ClassModel;
