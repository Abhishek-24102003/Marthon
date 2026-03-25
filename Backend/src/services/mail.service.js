import nodeMailer from "nodemailer";

const transporter = nodeMailer.createTransport({
   host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for port 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    // Add a connection timeout to prevent the crash
    connectionTimeout: 10000, // 10 seconds
})
export const sendmail = async (email,subject,body) => {
    const option = {
        to: email,
        subject: subject,
        html:body
    }
    return await transporter.sendMail(option);
}