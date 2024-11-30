import express from 'express';
import { adminMulter, createAdmin, deleteAllCourse, deleteAllFaculty, deleteAllStudent, deleteFacultyIdAdminAndFid, deleteStudentByIdandAdminId, findFacultyId, getAllCourse, getAllFaculty, getAllStudent } from '../controllers/admin.controller.js';

const adminRouter = express.Router();

adminRouter.post("/create-admin", adminMulter.single('adminProfile'), createAdmin)
adminRouter.get('/get-faculty/admin:adminid/:fid', findFacultyId)
adminRouter.get('/get-all-feculty/admin/:adminid', getAllFaculty)
adminRouter.delete('/delete-faculty-byid/admin/:adminid/:fid', deleteFacultyIdAdminAndFid);
adminRouter.delete('/delete-all-feculty/admin/:adminid', deleteAllFaculty)
adminRouter.delete('/delete-all-courses/admin/:adminid', deleteAllCourse);
adminRouter.get('/get-all-courses/admin/:adminid', getAllCourse);
adminRouter.get('/get-all-student/admin/:adminid', getAllStudent);
adminRouter.delete('/delete-student/admin/:adminid/:studentid', deleteStudentByIdandAdminId);
adminRouter.delete('/delete-all-student/admin/:adminid', deleteAllStudent)


export default adminRouter;