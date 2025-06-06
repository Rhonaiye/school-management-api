import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({}, { timestamps: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);
export default Attendance;
