import nodemailer from 'nodemailer';

const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number.parseInt(process.env.EMAIL_PORT),
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
};

const sendVerificationEmail = async (email, firstName, token) => {
    const transporter = createTransporter();
    const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Verify Your Library Account',
        html: `
      <!DOCTYPE html>
      <html lang="en-US">
        <head>
          <style>
            body { font-family: Georgia, serif; background: #f5f0e8; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: #fffdf7; border: 1px solid #d4b896; border-radius: 8px; overflow: hidden; }
            .header { background: #3d2b1f; color: #f5f0e8; padding: 40px 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; letter-spacing: 2px; }
            .header p { margin: 8px 0 0; opacity: 0.8; font-style: italic; }
            .body { padding: 40px 30px; }
            .body p { color: #3d2b1f; line-height: 1.7; font-size: 16px; }
            .button { display: inline-block; background: #c68642; color: white; padding: 14px 32px; text-decoration: none; border-radius: 4px; font-size: 16px; margin: 20px 0; letter-spacing: 1px; }
            .footer { background: #f5f0e8; padding: 20px 30px; text-align: center; font-size: 13px; color: #7a6652; border-top: 1px solid #d4b896; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Library Resource Center</h1>
              <p>Your gateway to knowledge</p>
            </div>
            <div class="body">
              <p>Dear ${firstName},</p>
              <p>Welcome to the Library Resource Center! We're delighted to have you join our community.</p>
              <p>To complete your registration and unlock access to our full catalog, please verify your email address:</p>
              <div style="text-align: center;">
                <a href="${verifyUrl}" class="button">Verify My Account</a>
              </div>
              <p>This link will expire in 24 hours.</p>
              <p>Happy reading,<br><em>The Library Team</em></p>
            </div>
            <div class="footer">
              If you didn't create an account, you can ignore this email.
            </div>
          </div>
        </body>
      </html>
    `,
    };
    return await transporter.sendMail(mailOptions);
};

module.exports = {sendVerificationEmail};
