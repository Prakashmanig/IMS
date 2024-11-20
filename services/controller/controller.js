import multer from "multer";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";

//Multer (Any Photo PDF Document POST)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
export const upload = multer({ storage: storage });

// Post API
export const createUser = async (req, res) => {
  const {firstname,lastname, username, gender, password, cpass, email } = req.body;
  const userprofile = req.file;
  if (!userprofile) {
    return res.status(400).json({ message: "Please upload a profile" });
  }
  if (firstname && lastname && username && gender && password && cpass && email) {
    const name = firstname+" "+lastname
    if (password !== cpass) {
      return res.status(400).json("Password not match");
    }
  const usernameRegex = /^[a-z0-9]+$/;
  if(!usernameRegex.test(username)){
    return res.status(400).json("Username should only contain lowercase letters and numbers");
  }
  const emailRegex = /^[a-z0-9]+@[a-z]+\.[a-z]+$/;
  if (!email.endsWith('@gmail.com') || !emailRegex.test(email)) {
    return res.status(400).json({error: 'Email must contain only lowercase letters and numbers and must end with @gmail.com.',
    });
  }
    try {
      const checkUserName = await userModel.findOne({username: username});
      if (checkUserName) {
        return res.status(400).json("Username allready exists");
      }
      const checkEmail = await userModel.findOne({ email: email });
      if (checkEmail) {
        return res.status(400).json("Email allready exists");
      }

      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);

      const user = userModel({
        name:name,
        username: username,
        gender: gender,
        password: hashPassword,
        email: email,
        userprofile: userprofile.filename,
      });

      if (user) {
        const savedUser = await user.save();
        return res.status(200).json({ message: "User created successfully", data: savedUser });
      } else {
        return res.status(400).json({ message: "Somthing went wrong while creating user" });
      }
    } catch (err) {
      return res.status(500).json({ message: "Controller internal error", errpr: err.message });
    }
  } else {
    return res.status(400).json({ message: "All fields are required" });
  }
};

// Get API (All users)
export const getAllUsers = async (req, res) => {
  try {
    const ignore = ['-password', '-email', '-__v']
    const users = await userModel.find().select(ignore);
    if (users) {
      return res.status(200).json({ message: "Users fetched successfully", data: users });
    } else {
      return res.status(400).json({ message: "No users found" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Controller internal error", errpr: err.message });
  }
};

// Get API (User by ID)
export const getUserById = async (req, res) => {
  const { userid } = req.params;
  if (!userid) {
    return res.status(400).json({ message: "User ID is required" });
  }
  try {
    const ignore = ['-password', '-email', '-__v']
    const checkUserId = await userModel.findOne({ _id: userid }).select(ignore);
    if (checkUserId) {
      return res.status(200).json({ message: "User fetched successfully", data: checkUserId });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Controller internal error", errpr: err.message });
  }
};


// Delete API (delete by ID)
export const deleteUser = async (req, res) => {
  const { userid } = req.params;
  if (!userid) {
    return res.status(400).json({ message: "User ID is required" });
  }
  try {
    const checkUserID = await userModel.findById(userid);
    if (!checkUserID) {
      return res.status(404).json({ message: "User not found" });
    } else {
      const deleteUser = await userModel.findByIdAndDelete(checkUserID);
      if (!deleteUser) {
        return res.status(400).json({ message: "Somthing went wrong while deleting user" });
      } else {
        return res.status(200).json({ message: "User deleted successfully", data: checkUserID });
      }
    }
  } catch (err) {
    return res.status(500).json({ message: "Controller internal error", errpr: err.message });
  }
};

// Update a user by ID
// export const updateUser = async (req, res) => {
//   const { userid } = req.params;
//   const { username, gender, password, email } = req.body;
//   const userprofile = req.file
//   if (!userid) {
//     return res.status(400).json({ message: "User ID is required" });
//   }
//   try {
//     const updatedUser = await userModel.findByIdAndUpdate(
//       userid,
//       { username, gender, password, email},
//       {userprofile},
//       { new: true }
//     );
//     if (!updatedUser) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     res.status(200).json({ message: "User updated successfully", data: updatedUser });
//   } catch (error) {
//     return res.status(500).json({ message: "Internal server error", error: error.message });
//   }
// };

export const updateUser = async (req, res) => {
    const { userid } = req.params;
    const { username, gender, password, email } = req.body;
    const userprofile = req.file?.path;
    if (!userid) {
      return res.status(400).json({ message: "User ID is required" });
    }
    try {
      const updateData = { username, gender, password, email };
      if (userprofile) { 
        updateData.userprofile = userprofile 
    }
      const updatedUser = await userModel.findByIdAndUpdate(userid, updateData,{ new: true });
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({ message: "User updated successfully", data: updatedUser });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error", error: error.message });
    }
  };
 