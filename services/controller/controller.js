import userModel from "../models/userModel.js"


// Post API
export const createUser = async (req, res) =>{
    const {username, gender, password, cpass, email} = req.body
    try {
        if(username && gender && password && cpass && email){
            if(password !== cpass){
                return res.status(400).json("Password not match")
            }
            const checkEmail = await userModel.findOne({email: email})
            if(checkEmail){
                return res.status(400).json("Email allready exists")
            }
            const user = userModel({
                username: username,
                gender: gender,
                password: password,
                email: email
            })
            if(user){
                const savedUser = await user.save()
                return res.status(200).json({message:"User created successfully", data:savedUser})
            }else{
                return res.status(400).json({message:"Somthing went wrong while creating user"});
            }
        }else{
            return res.status(400).json({message:"All fields are required"})
        }
    } catch (err) {
        return res.status(500).json({message:"Controller internal error", errpr: err.message})
    }
}

// Get API (All users)

export const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find()
        if(users){
            return res.status(200).json({message:"Users fetched successfully", data:users})
        }else{
            return res.status(400).json({message:"No users found"})
        }
    } catch (err) {
        return res.status(500).json({message:"Controller internal error", errpr: err.message})
    }
}

// Get API (User by ID)

export const getUserById = async (req, res) => {
    const { userid } = req.params
    if(!userid){
        return res.status(400).json({message:"User ID is required"})
    }
    try {
        const checkUserId = await userModel.findOne({_id: userid})
        if(checkUserId){
            return res.status(200).json({message:"User fetched successfully", data:checkUserId})
        }else{
            return res.status(404).json({message:"User not found"})
        }
    } catch (err) {
        return res.status(500).json({message:"Controller internal error", errpr: err.message})
    }
}

// Delete API (delete by ID)

export const deleteUser = async (req, res) => {
    const { userid } = req.params;
    if(!userid){
        return res.status(400).json({message:"User ID is required"})
    }
    try {
        const checkUserID = await userModel.findById(userid);
        if(!checkUserID){
            return res.status(404).json({message:"User not found"})
        }else{
            const deleteUser = await userModel.findByIdAndDelete(checkUserID)
            if(!deleteUser){
                return res.status(400).json({message:"Somthing went wrong while deleting user"})
            }else{
                return res.status(200).json({message:"User deleted successfully", checkUserID})
            }
        }
    } catch (err) {
        return res.status(500).json({message:"Controller internal error", errpr: err.message})
    }
}



// Update a user by ID
export const updateUser = async (req, res) => {
    const { userid } = req.params;
    const { username, gender, password, email } = req.body;
    if (!userid) {
        return res.status(400).json({ message: 'User ID is required' });
    }
    try {
        const updatedUser = await userModel.
        findByIdAndUpdate(userid,{ username, gender, password, email },{ new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User updated successfully', data: updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};



