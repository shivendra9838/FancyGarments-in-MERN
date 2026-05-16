const fs = require('fs');

let content = fs.readFileSync('database/controllers/userController.js', 'utf8');

// Add import if not exists
if (!content.includes('generateEmailTemplate')) {
    content = content.replace("import otpModel from '../models/otpModel.js';", "import otpModel from '../models/otpModel.js';\nimport { generateEmailTemplate } from '../utils/emailTemplate.js';");
}

// Replace login email
content = content.replace(
    /text: `Hi \$\{user\.name\},\\n\\nYour OTP for login is: \$\{otp\}\. It will expire in 5 minutes\.\\n\\nBest Regards,\\nFancy Garments Team`/g,
    "html: generateEmailTemplate(user.name, otp, 'Login')"
);

// Replace registration OTP email
content = content.replace(
    /text: `Hi \$\{name\},\\n\\nYour OTP for registration is: \$\{otp\}\. It will expire in 5 minutes\.\\n\\nBest Regards,\\nFancy Garments Team`/g,
    "html: generateEmailTemplate(name, otp, 'Account Registration')"
);

// Replace resend OTP email (name might not be available, we fallback to user lookup or 'User')
// Actually, let's look up the user in resendOtp first to get their name, or default to 'User'
// The regex finds the text block:
content = content.replace(
    /text: `Hi,\\n\\nYour new OTP is: \$\{otp\}\. It will expire in 5 minutes\.\\n\\nBest Regards,\\nFancy Garments Team`/g,
    "html: generateEmailTemplate('User', otp, 'Verification')"
);

// Replace forgot password OTP email
content = content.replace(
    /text: `Hi \$\{user\.name\},\\n\\nYour OTP to reset your password is: \$\{otp\}\. It will expire in 5 minutes\.\\n\\nBest Regards,\\nFancy Garments Team`/g,
    "html: generateEmailTemplate(user.name, otp, 'Password Reset')"
);

// Let's also update the "Welcome" email for successful registration since it's plain text
content = content.replace(
    /text: `Hi \$\{name\},\\n\\nWelcome to Fancy Garments! Your account has been successfully created\. Enjoy shopping with us\.\\n\\nBest Regards,\\nFancy Garments Team`/g,
    "html: generateEmailTemplate(name, 'N/A', 'Welcome to Fancy Garments! You can ignore the OTP field.')"
);

fs.writeFileSync('database/controllers/userController.js', content);
