const fs = require('fs');
let content = fs.readFileSync('database/controllers/userController.js', 'utf8');

const replacement = `const verifyForgotOtp = async (req, res) => {
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

export { loginUser`;

content = content.replace(/const verifyForgotOtp = async[\s\S]*?export { loginUser/g, replacement);

fs.writeFileSync('database/controllers/userController.js', content);
