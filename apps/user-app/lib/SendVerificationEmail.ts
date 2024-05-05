import VerificationEmail from "../email/SignUpVerify";
import { ApiResponse } from "./ApiResponse";
import { resend } from "./Resend";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
) {
    try {
        await resend.emails.send({
            from: "Acme <onboarding@resend.dev>",
            to: [email],
            subject: "Freelance Verification code",
            react: VerificationEmail({ username, otp: verifyCode }),
        });
        return new ApiResponse(200, "Email sent successfully", {});
    } catch (emailError) {
        console.log("Error sending verification email", emailError);
        return new ApiResponse(400, "Error sending the em", {});
    }
}

// TODO:: send email to other domains
