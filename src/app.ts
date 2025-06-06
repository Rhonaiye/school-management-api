import express from "express";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./modules/auth/auth.route";
import { errorHandler } from "./middleware/errorHandler";

export const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/auth", authRoutes);

app.use(errorHandler);

import studentsRoutes from './modules/students/students.route';
import teachersRoutes from './modules/teachers/teachers.route';
import classesRoutes from './modules/classes/classes.route';
import subjectsRoutes from './modules/subjects/subjects.route';
import attendanceRoutes from './modules/attendance/attendance.route';
import gradesRoutes from './modules/grades/grades.route';
import promotionsRoutes from './modules/promotions/promotions.route';
import timetableRoutes from './modules/timetable/timetable.route';
import reportsRoutes from './modules/reports/reports.route';

app.use('/api/students', studentsRoutes);
app.use('/api/teachers', teachersRoutes);
app.use('/api/classes', classesRoutes);
app.use('/api/subjects', subjectsRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/grades', gradesRoutes);
app.use('/api/promotions', promotionsRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/reports', reportsRoutes);
