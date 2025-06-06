import mongoose from 'mongoose';

const subjectsSchema = new mongoose.Schema({}, { timestamps: true });

const Subjects = mongoose.model('Subjects', subjectsSchema);
export default Subjects;
