import express from 'express';
import { createFaculty, deleteCourse, facultyMulter, getCourse, loginFaculty, updateFacultyById } from '../controllers/faculty.controller.js';

const facultyRouter = express.Router();

facultyRouter.post('/admin/:adminid/create-faculty', facultyMulter, createFaculty);
facultyRouter.post('/faculty-login', loginFaculty)
facultyRouter.put('/update-faculty/admin/:adminid/:fid', facultyMulter, updateFacultyById);
facultyRouter.get('/get-course/faculty/:fid', getCourse)
facultyRouter.delete('/delete-course/faculty/:fid/:cid', deleteCourse)

export default facultyRouter;