import express from 'express';
import { createFaculty, facultyMulter, getCourse, loginFaculty, updateFacultyById } from '../controllers/faculty.controller.js';

const facultyRouter = express.Router();

facultyRouter.post('/admin/:adminid/create-faculty', facultyMulter.single('facultyProfile'), createFaculty);
facultyRouter.post('/faculty-login', loginFaculty)
facultyRouter.put('/update-faculty/admin/:adminid/:fid', updateFacultyById);
facultyRouter.get('/get-course/faculty/:fid', getCourse)

export default facultyRouter;