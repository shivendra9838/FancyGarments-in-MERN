import validator from 'validator';
import bcrypt from 'bcrypt';
import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import path from 'path';
import otpModel from '../models/otpModel.js';
import { generateEmailTemplate } from '../utils/emailTemplate.js';
import { sendEmailViaResend as sendEmail } from '../utils/resendEmail.js';
import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID);

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

const getDisplayNameFromEmail = (email) => {
    const [name] = email.split('@');
    return name
        .split(/[._-]/)
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ') || 'Fancy Garments Customer';
};

const buildMagicLinkTemplate = (name, link, mode) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { margin: 0; padding: 0; background: #0e0b0f; font-family: Arial, Helvetica, sans-serif; color: #faf7f2; }
        .wrap { padding: 36px 16px; }
        .card { max-width: 560px; margin: 0 auto; background: #171218; border: 1px solid rgba(255,255,255,0.12); border-radius: 18px; overflow: hidden; }
        .head { padding: 28px 24px; text-align: center; background: linear-gradient(135deg, #c9a96e, #8f6d4b); color: #130e09; font-weight: 800; letter-spacing: 4px; }
        .body { padding: 34px 28px; text-align: center; }
        .btn { display: inline-block; margin: 18px 0 22px; padding: 14px 24px; border-radius: 12px; background: linear-gradient(135deg, #c9a96e, #a8835a); color: #130e09; text-decoration: none; font-weight: 800; }
        .muted { color: rgba(255,255,255,0.55); font-size: 13px; line-height: 1.6; }
    </style>
</head>
<body>
    <div class="wrap">
        <div class="card">
            <div class="head">FANCY GARMENTS</div>
            <div class="body">
                <h2>Hi ${name}</h2>
                <p>Click below to ${mode === 'signup' ? 'create your account' : 'sign in'} securely. This link expires in 5 minutes.</p>
                <a class="btn" href="${link}">${mode === 'signup' ? 'Create account' : 'Sign in'} securely</a>
                <p class="muted">If the button does not work, paste this link into your browser:<br>${link}</p>
                <p class="muted">If you did not request this, you can ignore this email.</p>
            </div>
        </div>
    </div>
</body>
</html>
`;

// Route for user login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        if (!user.password) {
            return res.json({ success: false, message: "This account uses Google or email link sign-in" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            const otp = generateOtp();
            await otpModel.deleteMany({ email });
            await otpModel.create({ email, otp });

            // Send OTP in background (non-blocking)
            sendEmail(email, 'Your Login OTP - Fancy Garments', generateEmailTemplate(user.name, otp, 'Login'))
                .catch(err => console.log("Error sending login OTP:", err.message));

            res.json({ success: true, message: "OTP sent to your email", isOtpRequired: true });
        } else {
            return res.json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
};

const googleAuth = async (req, res) => {
    try {
        const { credential } = req.body;
        const clientId = process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID;

        if (!clientId) {
            return res.json({ success: false, message: "Google sign-in is not configured. Add GOOGLE_CLIENT_ID to the backend environment." });
        }
        if (!credential) {
            return res.json({ success: false, message: "Missing Google credential" });
        }

        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: clientId,
        });
        const payload = ticket.getPayload();
        if (!payload?.email || !payload.email_verified) {
            return res.json({ success: false, message: "Google account email is not verified" });
        }

        let user = await userModel.findOne({ email: payload.email });
        if (!user) {
            user = await userModel.create({
                name: payload.name || getDisplayNameFromEmail(payload.email),
                email: payload.email,
                googleId: payload.sub,
                profileImg: payload.picture,
                authProvider: 'google',
            });
        } else {
            const updates = {
                googleId: user.googleId || payload.sub,
                authProvider: user.authProvider === 'password' ? 'password' : 'google',
            };
            if (!user.profileImg && payload.picture) updates.profileImg = payload.picture;
            await userModel.updateOne({ _id: user._id }, updates);
        }

        const token = createToken(user._id);
        res.json({ success: true, token, message: "Google sign-in successful" });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Google sign-in failed" });
    }
};

const requestMagicLink = async (req, res) => {
    try {
        const { email, name, mode = 'login', redirectBaseUrl } = req.body;
        if (!email || !validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const existingUser = await userModel.findOne({ email: normalizedEmail });
        if (mode === 'login' && !existingUser) {
            return res.json({ success: false, message: "No account found. Please create one first." });
        }

        const token = crypto.randomBytes(32).toString('hex');
        const displayName = name?.trim() || existingUser?.name || getDisplayNameFromEmail(normalizedEmail);
        const purpose = mode === 'signup' ? 'magic-signup' : 'magic-login';

        await otpModel.deleteMany({ email: normalizedEmail, purpose });
        await otpModel.create({ email: normalizedEmail, otp: token, purpose, name: displayName });

        const baseUrl = redirectBaseUrl || process.env.FRONTEND_URL || 'http://localhost:5173';
        const link = `${baseUrl.replace(/\/$/, '')}/login?magicToken=${token}&email=${encodeURIComponent(normalizedEmail)}&mode=${mode === 'signup' ? 'signup' : 'login'}`;

        await sendEmail(
            normalizedEmail,
            mode === 'signup' ? 'Create your Fancy Garments account' : 'Your Fancy Garments sign-in link',
            buildMagicLinkTemplate(displayName, link, mode === 'signup' ? 'signup' : 'login')
        );

        res.json({ success: true, message: "Secure email link sent. Please check your inbox." });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
};

const verifyMagicLink = async (req, res) => {
    try {
        const { email, token, mode = 'login' } = req.body;
        if (!email || !token) {
            return res.json({ success: false, message: "Invalid magic link" });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const purpose = mode === 'signup' ? 'magic-signup' : 'magic-login';
        const tokenRecord = await otpModel.findOne({ email: normalizedEmail, otp: token, purpose });
        if (!tokenRecord) {
            return res.json({ success: false, message: "Magic link is invalid or expired" });
        }

        let user = await userModel.findOne({ email: normalizedEmail });
        if (!user) {
            if (mode !== 'signup') {
                return res.json({ success: false, message: "No account found. Please create one first." });
            }

            user = await userModel.create({
                name: tokenRecord.name || getDisplayNameFromEmail(normalizedEmail),
                email: normalizedEmail,
                authProvider: 'email',
            });
        }

        await otpModel.deleteOne({ _id: tokenRecord._id });
        const authToken = createToken(user._id);
        res.json({ success: true, token: authToken, message: "Email sign-in successful" });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
};

// Verify Login OTP
const verifyLoginOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const otpRecord = await otpModel.findOne({ email, otp });
        if (!otpRecord) {
            return res.json({ success: false, message: "Invalid or expired OTP" });
        }

        const user = await userModel.findOne({ email });
        if (!user) return res.json({ success: false, message: "User not found" });

        await otpModel.deleteOne({ _id: otpRecord._id });
        const token = createToken(user._id);

        res.json({ success: true, token, message: "Login successful" });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
};

// Get User Profile after login
const getUserProfile = async (req, res) => {
    try {
        const user = await userModel.findById(req.userId).select("-password");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.json({ success: true, user });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Route for user registration
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const exist = await userModel.findOne({ email });
        if (exist) {
            return res.json({ success: false, message: "User already exists" });
        }
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Password must be at least 8 characters long" });
        }

        const otp = generateOtp();
        await otpModel.deleteMany({ email });
        await otpModel.create({ email, otp });

        // Send OTP in background (non-blocking)
        sendEmail(email, 'Your Registration OTP - Fancy Garments', generateEmailTemplate(name, otp, 'Account Registration'))
            .catch(err => console.log("Error sending registration OTP:", err.message));

        res.json({ success: true, message: "OTP sent to your email", isOtpRequired: true });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
};

// Verify Registration OTP
const verifyRegisterOtp = async (req, res) => {
    try {
        const { name, email, password, otp } = req.body;
        const otpRecord = await otpModel.findOne({ email, otp });
        if (!otpRecord) {
            return res.json({ success: false, message: "Invalid or expired OTP" });
        }

        const exist = await userModel.findOne({ email });
        if (exist) return res.json({ success: false, message: "User already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new userModel({ name, email, password: hashedPassword });
        const user = await newUser.save();

        await otpModel.deleteOne({ _id: otpRecord._id });
        const token = createToken(user._id);

        // Send welcome email in background
        sendEmail(email, 'Welcome to Fancy Garments', generateEmailTemplate(name, 'N/A', 'Welcome to Fancy Garments!'))
            .catch(err => console.log("Error sending welcome email:", err.message));

        res.json({ success: true, token, message: "Registration successful" });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
};

// Resend OTP
const resendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        const lastOtp = await otpModel.findOne({ email }).sort({ createdAt: -1 });
        if (lastOtp) {
            const timeDiff = (Date.now() - lastOtp.createdAt.getTime()) / 1000;
            if (timeDiff < 30) {
                return res.json({ success: false, message: `Please wait ${Math.ceil(30 - timeDiff)} seconds before resending` });
            }
        }

        const otp = generateOtp();
        await otpModel.deleteMany({ email });
        await otpModel.create({ email, otp });

        sendEmail(email, 'Your New OTP - Fancy Garments', generateEmailTemplate('User', otp, 'Verification'))
            .catch(err => console.log("Error resending OTP:", err.message));

        res.json({ success: true, message: "New OTP sent to your email" });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
};

// Route for admin login
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET);
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Update user profile
const updateUserProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const updateFields = {};
        const allowedFields = ['name', 'age', 'phone', 'address', 'subscription', 'mobile', 'gender'];
        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) updateFields[field] = req.body[field];
        });
        if (req.file && req.file.filename) {
            updateFields.profileImg = `/uploads/${req.file.filename}`;
        }
        const user = await userModel.findByIdAndUpdate(userId, updateFields, { new: true, select: '-password' });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.json({ success: true, user });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

const allUsers = async (req, res) => {
    try {
        const users = await userModel.find({}, 'email password');
        res.json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch users' });
    }
};

const allProfiles = async (req, res) => {
    try {
        const profiles = await userModel.aggregate([
            { $addFields: { userIdString: { $toString: '$_id' } } },
            { $lookup: { from: 'orders', localField: 'userIdString', foreignField: 'userId', as: 'orders' } },
            { $lookup: { from: 'wishlists', localField: '_id', foreignField: 'user', as: 'wishlist' } },
            { $unwind: { path: '$wishlist', preserveNullAndEmptyArrays: true } },
            {
                $addFields: {
                    totalOrders: { $size: '$orders' },
                    totalSpent: { $sum: '$orders.amount' },
                    wishlistItems: { $size: { $ifNull: ['$wishlist.items', []] } }
                }
            },
            {
                $project: {
                    password: 0,
                    'orders.userId': 0,
                    'wishlist.userId': 0,
                    'wishlist.items': 0,
                    userIdString: 0
                }
            }
        ]);
        res.json({ success: true, profiles });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to fetch profiles' });
    }
};

const deleteUserProfile = async (req, res) => {
    try {
        const user = await userModel.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete user' });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        const otp = generateOtp();
        await otpModel.deleteMany({ email });
        await otpModel.create({ email, otp });

        sendEmail(email, 'Password Reset OTP - Fancy Garments', generateEmailTemplate(user.name, otp, 'Password Reset'))
            .catch(err => console.log("Error sending password reset OTP:", err.message));

        res.json({ success: true, message: "OTP sent to your email", isOtpRequired: true });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

const verifyForgotOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const otpRecord = await otpModel.findOne({ email, otp });
        if (!otpRecord) {
            return res.json({ success: false, message: "Invalid or expired OTP" });
        }
        const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '15m' });
        await otpModel.deleteOne({ _id: otpRecord._id });
        res.json({ success: true, message: "OTP verified successfully", resetToken });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { email, newPassword, resetToken } = req.body;
        if (!resetToken) return res.json({ success: false, message: "Unauthorized. Please verify OTP first." });
        try {
            const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
            if (decoded.email !== email) return res.json({ success: false, message: "Unauthorized." });
        } catch (err) {
            return res.json({ success: false, message: "Reset token invalid or expired." });
        }
        if (newPassword.length < 8) {
            return res.json({ success: false, message: "Password must be at least 8 characters long" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        await userModel.findOneAndUpdate({ email }, { password: hashedPassword });
        res.json({ success: true, message: "Password reset successfully" });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

export { loginUser, verifyLoginOtp, googleAuth, requestMagicLink, verifyMagicLink, registerUser, verifyRegisterOtp, resendOtp, forgotPassword, verifyForgotOtp, resetPassword, adminLogin, getUserProfile, updateUserProfile, allUsers, allProfiles, deleteUserProfile };
