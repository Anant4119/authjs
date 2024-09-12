import User from '@/models/userModel';
import nodemailer from 'nodemailer'
import bcryptjs from 'bcryptjs'

export const sendEmail = async ({ email, emailType, userId }: any) => {

    try {

        const hashedToken = await bcryptjs.hash(userId.toString(), 10)

        if (emailType === "VERIFY") {
            await User.findByIdAndUpdate(userId, {
                $set: {
                    verifyToken: hashedToken,
                    verifyTokenExpiry: Date.now() + 3600000
                }

            })
        }
        else if (emailType === "RESET") {
            await User.findByIdAndUpdate(userId, {
                $set: {
                    forgotPasswordToken: hashedToken,
                    forgotPasswordTokenExpiry: Date.now() + 3600000
                }

            })
        }


        const htmlContent = emailType === "VERIFY" ? `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to verify your email or copy and paste the link below in your browser. <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}</p>` : `<p>Click <a href="${process.env.DOMAIN}/resetpassword?token=${hashedToken}">here</a> to rest your password or copy and paste the link below in your browser.<br>${process.env.DOMAIN}/resetpassword?token=${hashedToken}</br></p>`


        const transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "4db33c6ca7cb05",
                pass: "c02d29c45cbed1"
            }
        });

        const mailOptions = {
            from: 'akayhappy4119@gmail.com', // sender address
            to: email, // list of receivers
            subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password", // Subject line
            html: htmlContent
        }

        const mailResponse = await transport.sendMail(mailOptions);
        return mailResponse;
    }
    catch (error: any) {
        throw new Error(error.message)
    }
}