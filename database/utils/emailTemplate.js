export const generateEmailTemplate = (name, otp, action) => {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
        body {
            margin: 0;
            padding: 0;
            background-color: #0d1117;
            font-family: 'Inter', Helvetica, Arial, sans-serif;
            -webkit-font-smoothing: antialiased;
        }
        .wrapper {
            width: 100%;
            table-layout: fixed;
            background-color: #0d1117;
            padding: 40px 0;
        }
        .main {
            background-color: #161b22;
            margin: 0 auto;
            width: 100%;
            max-width: 600px;
            border-radius: 16px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            border: 1px solid #30363d;
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #6366f1, #a855f7, #ec4899);
            padding: 30px 20px;
            text-align: center;
        }
        .header h1 {
            color: #ffffff;
            margin: 0;
            font-size: 24px;
            font-weight: 700;
            letter-spacing: 1px;
        }
        .content {
            padding: 40px 30px;
            color: #c9d1d9;
            text-align: center;
        }
        .greeting {
            font-size: 20px;
            font-weight: 600;
            color: #ffffff;
            margin-bottom: 15px;
        }
        .message {
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 30px;
        }
        .otp-container {
            background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(236, 72, 153, 0.1));
            border: 1px solid rgba(168, 85, 247, 0.4);
            border-radius: 12px;
            padding: 20px;
            margin: 0 auto 30px auto;
            width: fit-content;
        }
        .otp-code {
            font-family: monospace;
            font-size: 36px;
            font-weight: 700;
            color: #ffffff;
            letter-spacing: 6px;
            margin: 0;
            text-align: center;
        }
        .footer {
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #8b949e;
            border-top: 1px solid #30363d;
        }
        .highlight {
            color: #a855f7;
            font-weight: 600;
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <table class="main" width="100%" cellpadding="0" cellspacing="0" role="presentation">
            <tr>
                <td class="header">
                    <h1>FANCY GARMENTS</h1>
                </td>
            </tr>
            <tr>
                <td class="content">
                    <div class="greeting">Hi ${name} 👋</div>
                    <div class="message">
                        Your secure access code is waiting below.<br>
                        Please use this OTP to complete your <span class="highlight">${action}</span>. This code will expire in <span class="highlight">5 minutes</span>.
                    </div>
                    <div class="otp-container">
                        <div class="otp-code">${otp}</div>
                    </div>
                    <div class="message" style="font-size: 14px; color: #8b949e;">
                        If you didn't request this code, you can safely ignore this email.
                    </div>
                </td>
            </tr>
            <tr>
                <td class="footer">
                    &copy; 2026 Fancy Garments. All rights reserved.<br>
                    Premium Fashion & Apparel
                </td>
            </tr>
        </table>
    </div>
</body>
</html>
    `;
};
