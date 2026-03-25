import nodeMailer from "nodemailer";

const transporter = nodeMailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    }
})
export const sendmail = async (email,subject,body) => {
    const option = {
        to: email,
        subject: subject,
        html:body
    }
    return await transporter.sendMail(option);
}