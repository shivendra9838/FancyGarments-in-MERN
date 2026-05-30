import transporter from '../config/nodemailer.js';

/**
 * sendOtpEmail - Sends emails via Nodemailer
 */
export const sendEmailViaResend = async (to, subject, htmlContent, senderName = 'Fancy Garments') => {
    const senderEmail = process.env.MAIL_FROM || process.env.MAIL_USERNAME;

    if (!senderEmail) {
        console.error("❌ MAIL_FROM/MAIL_USERNAME is missing from environment variables!");
        throw new Error("MAIL_FROM not set");
    }

    console.log(`📧 Sending email via Nodemailer to: ${to} | From: ${senderName} <${senderEmail}> | Subject: ${subject}`);

    const mailOptions = {
        from: `${senderName} <${senderEmail}>`,
        to: to,
        subject: subject,
        html: htmlContent
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent successfully to ${to} | id: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error("❌ Failed to send email via Nodemailer:", error.message);
        throw error;
    }
};
