import mongoose from 'mongoose';

const timetableSchema = new mongoose.Schema({}, { timestamps: true });

const Timetable = mongoose.model('Timetable', timetableSchema);
export default Timetable;
