import express from 'express';
import { createUser, deleteUser, getAllUsers, getUserById, updateUser } from '../controller/controller.js';
const userRouter = express.Router();

userRouter.post('/createuser', createUser);
userRouter.get('/getuser', getAllUsers)
userRouter.get('/getuser/:userid', getUserById);
userRouter.delete('/deleteuser/:userid', deleteUser);
userRouter.put('/updateuser/:userid', updateUser);

export default userRouter;