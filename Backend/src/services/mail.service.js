import nodeMailer from "nodemailer";

const transporter = nodeMailer.createTransport({
// Direct IPv4 for smtp.gmail.com
    host: "74.125.136.108", 
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    // Required when using IP instead of hostname
    tls: {
        rejectUnauthorized: false 
    },
    connectionTimeout: 10000,
})
export const sendmail = async (email,subject,body) => {
    const option = {
        to: email,
        subject: subject,
        html:body
    }
    return await transporter.sendMail(option);
}