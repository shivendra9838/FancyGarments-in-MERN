
import express from 'express';
import { loginUser, registerUser, adminLogin, getUserProfile, updateUserProfile, allUsers, allProfiles, deleteUserProfile } from '../controllers/userController.js';
import authUser from '../middleware/auth.js';
import { profileImageUpload } from '../middleware/multer.js';

const userRouter = express.Router();

// Public routes
userRouter.post('/login', loginUser);
userRouter.post('/register', registerUser);

// Admin routes
userRouter.post('/admin', adminLogin);
userRouter.get('/all', allUsers);
userRouter.get('/all-profiles', allProfiles);
userRouter.delete('/profile/:id', deleteUserProfile);

// Authenticated user routes
userRouter.post('/profile', authUser, getUserProfile);
userRouter.post('/profile/update-image', authUser, profileImageUpload, updateUserProfile);


export default userRouter;
