import express from 'express';
import { createUser, deleteUser, getAllUsers, getUserById, updateUser, upload } from '../controller/controller.js';
const userRouter = express.Router();

userRouter.post('/createuser', upload.single('userprofile'), createUser);
userRouter.get('/getuser', getAllUsers)
userRouter.get('/getuser/:userid', getUserById);
userRouter.delete('/deleteuser/:userid', deleteUser);
userRouter.put('/updateuser/:userid',upload.single('userprofile'), updateUser);

export default userRouter;