const nodemailer = require('nodemailer');

async function sendVerificationEmail(email, verificationToken) {
    const transporter = nodemailer.createTransport({
        host: 'smtp.example.com',
        port: 587,
        secure: false,
        auth: {
            user: 'your_smtp_username',
            pass: 'your_smtp_password'
        }
    });

    const mailOptions = {
        from: 'your_email@example.com',
        to: email,
        subject: 'Email Verification', 
        html: `<p>Click the following link to verify your email address:</p>
               <a href="http://example.com/verify-email?email=${email}&token=${verificationToken}">Verify Email</a>`
    };

    await transporter.sendMail(mailOptions);
}

module.exports = sendVerificationEmail;