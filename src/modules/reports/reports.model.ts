import mongoose from 'mongoose';

const reportsSchema = new mongoose.Schema({}, { timestamps: true });

const Reports = mongoose.model('Reports', reportsSchema);
export default Reports;
