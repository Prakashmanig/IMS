import multer from "multer"
import mongoose from "mongoose"
import path from "path"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import "dotenv/config"
import handleError from "../middleware/error_logs/handleError.js"
import adminModel from "../models/admin.model.js"
import facultyModel from "../models/faculty.model.js"
import courseModel from "../models/course.model.js"
import studentModel from "../models/student.model.js"

const kye = process.env.SECRET_KEY


const adminPath = path.join("public/admin/")
const store = multer.diskStorage({
    destination: (req, file, cb) => {
       return cb(null, adminPath)
    },
    filename: (req, file, cb) => {
       return cb(null, file.originalname)
    }
})
export const adminMulter = multer({storage: store}).single('adminProfile')


// ! POST API (Admin register)
export const createAdmin = async (req, res) => {
    const { adminName, adminEmail, adminPassword } = req.body;
    const adminProfile = req.file;
    if (!adminProfile) {
        return handleError(res, 400, "Admin profile is required");
    }
    if (adminName && adminEmail && adminPassword) {
        try {
            const checkEmail = await adminModel.findOne({ adminEmail:adminEmail });
            if (checkEmail) {
                return handleError(res, 400, "Email already exists");
            }
            const salt = await bcrypt.genSalt(12);
            const hashPass = await bcrypt.hash(adminPassword, salt);
            const adminUser = new adminModel({
                adminName:adminName,
                adminEmail:adminEmail,
                adminPassword: hashPass,
                adminProfile: adminProfile.filename
            });
            const saveAdmin = await adminUser.save();
            if (saveAdmin) {
                const token = jwt.sign({ userID: saveAdmin._id }, kye, { expiresIn: "4d" });
                return handleError(res, 201, "Admin created successfully", saveAdmin, token);
            } else {
                return handleError(res, 400, "Admin create failed");
            }
        } catch (error) {
            console.log(error);
            return handleError(res, 500, "Internal Server error (Admin Create)");
        }
    } else {
        return handleError(res, 400, "All fields are required");
    }
};



//! login admin
export const loginAdmin = async (req, res) => {
  const { adminEmail, adminPassword } = req.body;
  if ( adminEmail && adminPassword) {
      try {
          const checkEmail = await adminModel.findOne({ adminEmail: adminEmail });
          if (!checkEmail) {
              return handleError(res, 404, "Invaild Email or password");
          }
          const isMatch = await bcrypt.compare(adminPassword, checkEmail.adminPassword);
          if (!isMatch) {
              return handleError(res, 401, "Invalid Email or password");
          }
          return handleError(res, 200, "Admin login successful", checkEmail);
      } catch (error) {
          return handleError(res, 500, "Internal Server Error (Faculty Login Error)", error);
      }
  }else{
      return handleError(res, 400, "Email and Password are required");
  }
};


// Admin Update
export const updateAdminById = async (req, res) => {
  const { adminid } = req.params
  if (!adminid || !mongoose.Types.ObjectId.isValid(adminid)) {
    return handleError(res, 400, "Invalid or missing Admin ID");
  }
  const { adminName, adminEmail, adminPassword } = req.body;
  const adminProfile = req.file
  try {
    const admin = await adminModel.findById(adminid);
    if (!admin) {
      return handleError(res, 404, "Admin not found");
  }
  const updateData = { adminName, adminEmail, adminPassword }
  if(adminProfile){
    updateData.adminProfile = adminProfile.filename;
  }
  if(adminPassword){
    const salt = await bcrypt.genSalt(12);
    const hashPass = await bcrypt.hash(adminPassword, salt);
    updateData.adminPassword = hashPass;
  }
  const updateAdmin = await adminModel.findByIdAndUpdate(adminid, updateData, {new:true});
  console.log(12);
  if (!updateAdmin) {
    return handleError(res, 400, "Admin update failed");
  }else{
    return handleError(res, 200, "Admin updated successfully", updateAdmin);
  }
  } catch (error) {
    return handleError(res, 400, "Internal Server Error", error);
  }
}



// Find Faculty by AdminId and FacultyId
export const findFacultyId = async (req, res) => {
  const { adminid, fid } = req.params;
  if (!adminid || !mongoose.Types.ObjectId.isValid(adminid)) {
    return handleError(res, 400, "Invalid or missing Admin ID");
  }
  if (!fid || !mongoose.Types.ObjectId.isValid(fid)) {
    return handleError(res, 400, "Invalid or missing Faculty ID");
  }

  try {
    const admin = await adminModel.findById(adminid);
    if (!admin) {
      return handleError(res, 404, "Admin not found");
    }
    const faculty = await facultyModel.findById(fid);
    if (!faculty) {
      return handleError(res, 404, "Faculty not found");
    }
    return res.status(200).json({
      success: true,
      message: "Faculty found successfully",
      faculty
    });
  } catch (error) {
    console.error("Error finding faculty:", error);
    return handleError(res, 500, "Server error", error);
  }
};



// get all faculty by admin
export const getAllFaculty  = async (req, res) => {
  const { adminid } = req.params;
  if(!adminid || !mongoose.Types.ObjectId.isValid(adminid))
    return handleError(res, 400, "Invalid or missing Admin ID");
  try {
    const isValidAdminId = await adminModel.findById(adminid);
    if(!isValidAdminId){
      return handleError(res, 404, "Admin not found");
    }

    const allFaculty = await facultyModel.find();
    if (allFaculty) {
      return res.status(200).json({ message: "Faculty fetched successfully", data: allFaculty });
    } else {
      return res.status(400).json({ message: "No Faculty found" });
    }
  } catch (error) {
    return res.status(400).json({ message:"Server error (AllFaculty)", error});
  }
}



// Delete faculty by admin id and fid
export const deleteFacultyIdAdminAndFid = async (req, res) => {
  const { adminid, fid } = req.params;
  if (!adminid || !mongoose.Types.ObjectId.isValid(adminid)) {
    return handleError(res, 400, "Invalid or missing Admin ID");
  }
  if (!fid || !mongoose.Types.ObjectId.isValid(fid)) {
    return handleError(res, 400, "Invalid or missing Faculty ID");
  }
  try {
     const admin = await adminModel.findById(adminid);
     if (!admin) {
       return handleError(res, 404, "Admin not found");
     }
     const faculty = await facultyModel.findById(fid);
     if (!faculty) {
       return handleError(res, 404, "Faculty not found");
     }
     if(admin && faculty){
      const deleteFaculty = await facultyModel.findByIdAndDelete(faculty);
      if (!deleteFaculty) {
         return handleError(res, 404, "Faculty not found to delete");
      }

      const deleteAssociatedCourse = await courseModel.deleteMany({facultyId : faculty})
      if(deleteAssociatedCourse){
        return handleError(res, 200, "Faculty and associated courses deleted successfully", deleteFaculty)
        }else{
          return handleError(res, 404, "Faculty and associated courses not detected")
        }

      // if(deleteFaculty){
      //   const deleteAssociatedCourse = await courseModel.deleteMany({facultyId : faculty})
      //   if(deleteAssociatedCourse){
      //     return res.status(200).json({ message: "Faculty and associated courses deleted successfully", data: deleteFaculty });
      //   }else{
      //     return res.status(400).json({ message: "Faculty not found to delete associated courses" });
      //   }
      // }
     }
  } catch (error) {
    return res.status(400).json({ message:"server error", error})
  }
}



// Delete All Faculty By Admin Id
export const deleteAllFaculty = async (req, res) => {
  const { adminid } = req.params;
  if (!adminid || !mongoose.Types.ObjectId.isValid(adminid)) {
    return handleError(res, 400, "Invalid or missing Admin ID");
  }
  try {
    const admin = await adminModel.findById(adminid);
     if (!admin) {
       return handleError(res, 404, "Admin not found");
     }
    const faculty = await facultyModel.deleteMany()
    if (faculty) {
      return res.status(200).json({ message: "All Faculty Delete Successfully", data: faculty });
    } else {
      return res.status(400).json({ message: "No Faculty found" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Controller internal error (Delete Fuclty)", errpr: err.message });
  }
};



// GET All Courses
export const getAllCourse = async(req, res) => {
  const { adminid } = req.params
  if (!adminid ||!mongoose.Types.ObjectId.isValid(adminid)) {
    return handleError(res, 400, "Invalid or missing Admin ID");
  }

  const isValidAdminId = await adminModel.findById(adminid);
  if(!isValidAdminId){
    return handleError(res, 404, "Admin not found");
  } 
  try {
    const getAllCourse = await courseModel.find();
    if (getAllCourse) {
      return handleError(res, 200, "All Courses fatched successfully", getAllCourse);
    }
  } catch (error) {
    return handleError(res, 500, "Server error", error);
  }
}



// deleteAllCourse
export const deleteAllCourse = async(req, res) => {
  const { adminid } = req.params
  if (!adminid ||!mongoose.Types.ObjectId.isValid(adminid)) {
    return handleError(res, 400, "Invalid or missing Admin ID");
  }

  const isValidAdminId = await adminModel.findById(adminid);
  if(!isValidAdminId){
    return handleError(res, 404, "Admin not found");
  } 
  try {
    const daleteAllCourse = await courseModel.deleteMany();
    if (daleteAllCourse) {
      return handleError(res, 200, "All Courses deleted successfully", deleteAllCourse);
    }
  } catch (error) {
    return handleError(res, 500, "Server error", error);
  }
}



// GET all students
export const getAllStudent = async(req, res) => {
  const { adminid } = req.params
  if (!adminid ||!mongoose.Types.ObjectId.isValid(adminid)) {
    return handleError(res, 400, "Invalid or missing Admin ID");
  }

  const isValidAdminId = await adminModel.findById(adminid);
  if(!isValidAdminId){
    return handleError(res, 404, "Admin not found");
  } 
  try {
    const getAllStudent = await studentModel.find();
    if (getAllStudent) {
      return handleError(res, 200, "All Students fatched successfully", getAllStudent);
    }
  } catch (error) {
    return handleError(res, 500, "Server error", error);
  }
}



// Delete student by adminid and sid
export const deleteStudentByIdandAdminId = async (req, res) => {
  const { adminid, studentid} = req.params
  if (!adminid ||!mongoose.Types.ObjectId.isValid(adminid)) {
    return handleError(res, 400, "Invalid or missing Admin ID");
  }
  if(!studentid ||!mongoose.Types.ObjectId.isValid(studentid)) {
    return handleError(res, 400, "Invalid or missing studentid");
  }
  try {
    const isValidAdminId = await adminModel.findById(adminid)
    if(!isValidAdminId){
      return handleError(res, 404, "Admin not found");
    }
    const deleteStudent = await studentModel.findByIdAndDelete(studentid)
      if(!deleteStudent){
        return handleError(res, 404, "Student not found to delete");
      }
      return handleError(res, 200, "Student deleted successfully", deleteStudent);
  } catch (error) {
    return handleError(res, 500, "Internal server error", error)
  }
}



// Delete all students
export const deleteAllStudent = async(req, res) => {
  const {adminid } =req.params
  if (!adminid ||!mongoose.Types.ObjectId.isValid(adminid)) {
    return handleError(res, 400, "Invalid or missing Admin ID");
  }
  try {
    const isValidAdminId = await adminModel.findById(adminid)
    if(!isValidAdminId){
      return handleError(res, 404, "Admin not found");
    }
    const deleteAllStudent = await studentModel.deleteMany()
    if(deleteAllStudent){
      return handleError(res, 200, "All Students deleted successfully", deleteAllStudent);
    }else{
      return handleError(res, 404, "No student found to delete");
    }
  } catch (error) {
    return handleError(res, 500, "Internal server error", error)
  }
}