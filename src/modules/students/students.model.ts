import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const StudentSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' }, // optional
    studentId: { type: String, unique: true, required: true },
    fullName: { type: String, required: true },
    classId: { type: Schema.Types.ObjectId, ref: 'Class' },
    dateOfBirth: Date,
    guardianContact: String,
    address: String,
    grades: [{type: Schema.Types.ObjectId, ref: 'Grade'}], // optional, to store grades
    // add grades, attendance etc.
  });
const Student = mongoose.model('Student', StudentSchema);
export default Student;  