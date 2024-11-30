import express from "express";
import { courseMulter, createCourse, updateCourse } from "../controllers/course.controller.js";

const courseRouter = express.Router();

courseRouter.post('/create-course/:fid', courseMulter, createCourse)
courseRouter.put('/update-course/faculty/:fid/:cid', courseMulter, updateCourse)

export default courseRouter;