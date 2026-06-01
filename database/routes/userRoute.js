
import express from 'express';
import { loginUser, verifyLoginOtp, googleAuth, requestMagicLink, verifyMagicLink, registerUser, verifyRegisterOtp, resendOtp, forgotPassword, verifyForgotOtp, resetPassword, adminLogin, getUserProfile, updateUserProfile, allUsers, allProfiles, deleteUserProfile } from '../controllers/userController.js';
import authUser from '../middleware/auth.js';
import { profileImageUpload } from '../middleware/multer.js';

const userRouter = express.Router();

// Public routes
userRouter.post('/login', loginUser);
userRouter.post('/verify-login-otp', verifyLoginOtp);
userRouter.post('/google', googleAuth);
userRouter.post('/request-magic-link', requestMagicLink);
userRouter.post('/verify-magic-link', verifyMagicLink);
userRouter.post('/register', registerUser);
userRouter.post('/verify-register-otp', verifyRegisterOtp);
userRouter.post('/resend-otp', resendOtp);
userRouter.post('/forgot-password', forgotPassword);
userRouter.post('/verify-forgot-otp', verifyForgotOtp);
userRouter.post('/reset-password', resetPassword);

// Admin routes
userRouter.post('/admin', adminLogin);
userRouter.get('/all', allUsers);
userRouter.get('/all-profiles', allProfiles);
userRouter.delete('/profile/:id', deleteUserProfile);

// Authenticated user routes
userRouter.post('/profile', authUser, getUserProfile);
userRouter.post('/profile/update-image', authUser, profileImageUpload, updateUserProfile);


export default userRouter;
