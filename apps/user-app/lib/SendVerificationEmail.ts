import VerificationEmail from "../email/SignUpVerify";
import { render } from "@react-email/render";


import nodemailer from "nodemailer"
export async function sendMail(email: string, username: string, verifyCode: string) {
    // Create a transporter
    let transporter = nodemailer.createTransport({
        service: 'Gmail', // e.g., 'Gmail', 'Yahoo', 'Outlook'
        auth: {
            user: process.env.SENDER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });
    const htmlContent = render(VerificationEmail({ username, otp: verifyCode }))
    // Setup email data
    let mailOptions = {
        from: process.env.SENDER,
        to: email,
        subject: 'Mystery message Verification Code', // Subject line
        html: htmlContent,
    };

    // Send mail
    transporter.sendMail(mailOptions, (error, _) => {
        if (error) {
            return console.log(error);
        }
    });
}
