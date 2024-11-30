import mongoose from "mongoose";
import handleError from "../middleware/error_logs/handleError.js";
import courseModel from "../models/course.model.js";
import facultyModel from "../models/faculty.model.js";
import multer from "multer";
import path from "path";


const coursePath = path.join("public/course/")
const store = multer.diskStorage({
    destination: (req, file, cd) =>{
        return cd(null, coursePath);
    },
    filename: (req, file, cd) => {
        return cd(null, file.originalname);
    }
    })
export const courseMulter = multer({ storage: store }).single('coursePdf');



// ! Create a new Course
// ! POST API
export const createCourse = async (req, res) => {
  const { fid } = req.params;
  if (!fid || !mongoose.Types.ObjectId.isValid(fid)) {
    return handleError(res, 400, "Invalid or missing Faculty ID");
  }
  const couserPdf = req.file;
  if (!couserPdf) {
    return handleError(res, 400, "Course PDF is required");
  }
  const { courseTitle, courseContent, courseAuthor, facultyId } = req.body;
  if (courseTitle && courseContent && courseAuthor && facultyId) {
    try {
      const faculty = await facultyModel.findById(fid);
      if (!faculty) {
        return handleError(res, 404, "Faculty not found");
      }
      const checkId = faculty._id.toString() !== facultyId.toString()
      if (checkId){
        return handleError(res, 403, "Unauthorized access");
      }
      
      const storeCourse = new courseModel({
        courseTitle: courseTitle,
        courseContent: courseContent,
        courseAuthor: courseAuthor,
        facultyId: facultyId,
        coursePdf: couserPdf.filename,
      });

      if (storeCourse) {
        await storeCourse.save();
        return handleError(res, 200, "Course successfully created", storeCourse);
      } else {
        return handleError(res, 400, "Course creation failed");
      }
    } catch (error) {
      return handleError(res, 500, "server error", error);
    }
  } else {
    return handleError(res, 403, "All fields must be required");
  }
};
















