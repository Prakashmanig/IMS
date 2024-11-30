import bcrypt from "bcrypt";
import mongoose from "mongoose"
import facultyModel from "../models/faculty.model.js";
import multer from "multer";
import handleError from "../middleware/error_logs/handleError.js";
import adminModel from "../models/admin.model.js"
import path from "path"
import courseModel from "../models/course.model.js";


const facultyPath = path.join("public/faculty/")
const store = multer.diskStorage({
    destination: (req, file, cb) => {
       return cb(null, facultyPath)
    },
    filename: (req, file, cb) => {
       return cb(null, file.originalname)
    }
})
export const facultyMulter = multer({storage: store})



//! POST API (Faculty register)
export const createFaculty = async (req, res) => {
    const { adminid } = req.params;
    const { facultyName, facultyEmail, facultyMobile, facultyPassword, adminId } = req.body;
    const facultyProfile = req.file;

    if (!facultyProfile) {
        return handleError(res, 400, "Faculty profile is required");
    }
    if (facultyName && facultyEmail && facultyMobile && facultyPassword && adminId) {
        try {
            const verifyAdminId = await adminModel.findById(adminid);
            if (!verifyAdminId) {
                return handleError(res, 404, "Invalid admin id");
            }
            if (verifyAdminId._id.toString() !== adminId.toString()) {
                return handleError(res, 403, "Admin id is not matching");
            }
            const checkEmail = await facultyModel.findOne({ facultyEmail: facultyEmail });
            if (checkEmail) {
                return handleError(res, 400, "Email already use");
            }
            const salt = await bcrypt.genSalt(12);
            const hashPass = await bcrypt.hash(facultyPassword, salt);

            const facultyUser = new facultyModel({
                facultyName: facultyName,
                facultyEmail: facultyEmail,
                facultyMobile: facultyMobile,
                facultyPassword: hashPass,
                adminId: adminId,
                facultyProfile: facultyProfile.filename,
            });

            const saveFaculty = await facultyUser.save();
            if(saveFaculty) {
            return handleError(res, 201, "Faculty created successfully", saveFaculty);
            } else {
            return handleError(res, 400, "Faculty creation failed");
            }
        } catch (error) {
            console.error(error);
            return handleError(res, 500, "Internal Server Error (Faculty Creation Error)", error);
        }
    } else {
        return handleError(res, 400, "All fields are required");
    }
};



// ! Login api faculty
export const loginFaculty = async (req, res) => {
    const { facultyEmail, facultyPassword } = req.body;
    if (facultyEmail && facultyPassword) {
        try {
            const checkEmail = await facultyModel.findOne({ facultyEmail: facultyEmail });
            if (!checkEmail) {
                return handleError(res, 404, "Invaild Email or password");
            }
            const isMatch = await bcrypt.compare(facultyPassword, checkEmail.facultyPassword);
            if (!isMatch) {
                return handleError(res, 401, "Invalid Email or password");
            }
            return handleError(res, 200, "Faculty login successful");
        } catch (error) {
            return handleError(res, 500, "Internal Server Error (Faculty Login Error)", error);
        }
    }else{
        return handleError(res, 400, "Email and Password are required");
    }
};



  // Update faculty by admin id and fid
export const updateFacultyById = async (req, res) => {
  const {adminid, fid} = req.params
  
  if (!adminid || !mongoose.Types.ObjectId.isValid(adminid)) {
    return handleError(res, 400, "Invalid or missing Admin ID");
  }
  if (!fid || !mongoose.Types.ObjectId.isValid(fid)) {
    return handleError(res, 400, "Invalid or missing Faculty ID");
  }
  const { facultyName, facultyEmail, facultyMobile, adminId } = req.body;
  try {
    const admin = await adminModel.findById(adminid);
  if (!admin) {
    return handleError(res, 404, "Admin not found");
  }
  const faculty = await facultyModel.findById(fid);
  if (!faculty) {
    return handleError(res, 404, "Faculty not found");
  }
  const checkId = admin._id.toString() !== adminId.toString();
  if (checkId) {
    return handleError(res, 403, "Unauthorized access");
  }
  const updateData = { facultyName, facultyEmail, facultyMobile, adminId }
  const updateFaculty = await facultyModel.findByIdAndUpdate(fid, updateData, {new:true});
  if (!updateFaculty) {
    return handleError(res, 400, "Faculty update failed");
  }else{
    return handleError(res, 200, "Faculty updated successfully", updateFaculty);
  }
  } catch (error) {
    return handleError(res, 400, "Internal Server Error", error);
  }
}



// get courses by faculty
export const getCourse = async (req, res) => {
  const { fid } = req.params;
  if (!fid ||!mongoose.Types.ObjectId.isValid(fid)) {
    return handleError(res, 400, "Invalid or missing Faculty ID");
  }
  try {
    const isValidFacultyId = await facultyModel.findById(fid)
    if (!isValidFacultyId) {
      return handleError(res, 404, "Faculty not found");
    }
    const facultyCourses = await courseModel.find({ facultyId: isValidFacultyId }).populate('facultyId')
    if(!facultyCourses){
      return handleError(res, 404, "No courses found for this faculty");
    }else{
      return handleError(res, 200, "Faculty courses", facultyCourses);
    }
  } catch (error) {
    return handleError(res, 400, "Internal Server Error", error);
  }
}