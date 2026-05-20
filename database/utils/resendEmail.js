/**
 * sendOtpEmail - Sends emails via Brevo HTTP API
 * Works on Render, Railway, Vercel, etc. (no SMTP port blocking)
 * Free plan: 300 emails/day
 */
export const sendEmailViaResend = async (to, subject, htmlContent, senderName = 'Fancy Garments') => {
    const apiKey = process.env.BREVO_API_KEY;
    const senderEmail = process.env.MAIL_FROM || process.env.MAIL_USERNAME;

    if (!apiKey) {
        console.error("❌ BREVO_API_KEY is missing from environment variables!");
        throw new Error("BREVO_API_KEY not set");
    }
    if (!senderEmail) {
        console.error("❌ MAIL_FROM/MAIL_USERNAME is missing from environment variables!");
        throw new Error("MAIL_FROM not set");
    }

    console.log(`📧 Sending email via Brevo HTTP API to: ${to} | From: ${senderEmail} | Subject: ${subject}`);

    const payload = {
        sender: { name: senderName, email: senderEmail },
        to: [{ email: to }],
        subject: subject,
        htmlContent: htmlContent
    };

    try {
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'api-key': apiKey,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("❌ Brevo API Error Response:", JSON.stringify(data));
            if (data.message && data.message.includes("SMTP account is not yet activated")) {
                console.error("💡 Action Required: You must activate transactional emails (SMTP) in your Brevo account dashboard.");
            }
            throw new Error(data.message || `Brevo error: ${response.status}`);
        }

        console.log(`✅ Email sent successfully to ${to} | messageId: ${data.messageId}`);
        return data;
    } catch (error) {
        console.error("❌ Failed to send email via Brevo API:", error.message);
        throw error;
    }
};


