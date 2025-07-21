
import express from "express";
import { loginUser, registerUser, adminLogin, getUserProfile, updateUserProfile } from "../controllers/userController.js";
import authUser from "../middleware/auth.js";
import { profileImageUpload } from "../middleware/multer.js";
import path from 'path';
import userModel from '../models/userModel.js';

const userRouter = express.Router();

userRouter.post('/login', loginUser);
userRouter.post('/register', registerUser);
userRouter.post('/admin', adminLogin);
userRouter.post('/profile', authUser, getUserProfile);
userRouter.post('/profile/update', profileImageUpload, authUser, updateUserProfile);
userRouter.post('/profile/update-image', profileImageUpload, authUser, updateUserProfile);

// Admin: get all users (email, password)
userRouter.get('/all', async (req, res) => {
  try {
    const users = await userModel.find({}, 'email password');
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch users', error: err.message });
  }
});

export default userRouter;
