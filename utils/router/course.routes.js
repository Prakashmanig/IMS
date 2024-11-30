import express from "express";
import { courseMulter, createCourse } from "../controllers/course.controller.js";

const courseRouter = express.Router();

courseRouter.post('/create-course/:fid', courseMulter, createCourse)

export default courseRouter;