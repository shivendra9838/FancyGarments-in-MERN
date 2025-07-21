import validator from 'validator';
import bcrypt from 'bcrypt';
import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import path from 'path';

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' }); // set token expiration
};

// Route for user login 
const loginUser = async (req, res) => {
    try{
        const { email, password } = req.body;       
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            const token = createToken(user._id);
            res.json({ success: true,  token });
        }
        else {
            return res.json({ success: false, message: "Invalid credentials" });
        }
    }catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
};

// 👤 Get User Profile after login
const getUserProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId).select("-password"); // Hide password
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Route for user registration
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // Check if user already exists
        const exist = await userModel.findOne({ email });
        if (exist) {
            return res.json({ success: false, message: "User already exists" });
        }
        // Validate email and password
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Password must be at least 8 characters long" });
        }
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        // Create and save new user
        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
        });
        const user = await newUser.save();
        // ✅ Generate token using user._id
        const token = createToken(user._id);
        res.json({ success: true, token });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
};

// Route for admin login 
const adminLogin = async (req, res) => {
    try{
        const {email, password} = req.body;
        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
            const token = jwt.sign(email+password,process.env.JWT_SECRET);
            res.json({success:true,token});
        }else{
            res.json({success:false,message:"Invalid credentials"})
        }
    }catch(error){
        console.log(error);
        res.json({success:false,message:error.message});
    }
};

// Update user profile (advanced)
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const updateFields = {};
    const allowedFields = ['name', 'age', 'phone', 'address', 'subscription'];
    allowedFields.push('mobile');
    allowedFields.push('gender');
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

export { loginUser, registerUser, adminLogin, getUserProfile, updateUserProfile };
