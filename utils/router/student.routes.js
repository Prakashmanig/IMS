import express from 'express';
import { createStudent, loginStudent, studentMulter, updateStudent } from '../controllers/student.controller.js';


const studentRouter = express.Router();

studentRouter.post('/create-student/admin/:adminid', studentMulter, createStudent);
studentRouter.get("/login-student", loginStudent);
studentRouter.put('/update-student/admin/:adminid/:studentid', updateStudent);

export default studentRouter;