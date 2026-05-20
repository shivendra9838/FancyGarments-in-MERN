import transporter from '../config/nodemailer.js';

/**
 * sendOtpEmail - Sends emails via Nodemailer using Gmail SMTP
 */
export const sendEmailViaResend = async (to, subject, htmlContent, senderName = 'Fancy Garments') => {
    const senderEmail = process.env.MAIL_FROM || process.env.MAIL_USERNAME;

    if (!senderEmail) {
        console.error("❌ MAIL_FROM is missing from environment variables!");
        throw new Error("MAIL_FROM not set");
    }

    console.log(`📧 Sending email to: ${to} | From: ${senderEmail} | Subject: ${subject}`);

    try {
        const info = await transporter.sendMail({
            from: `"${senderName}" <${senderEmail}>`,
            to: to,
            subject: subject,
            html: htmlContent
        });

        console.log(`✅ Email sent successfully to ${to} | messageId: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error("❌ Failed to send email via Nodemailer:", error.message);
        throw error;
    }
};

