import nodeMailer from "nodemailer";

const transporter = nodeMailer.createTransport({
 host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    // This forces Node to use IPv4 instead of IPv6
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
    dnsProjection: "ipv4first"
})
export const sendmail = async (email,subject,body) => {
    const option = {
        to: email,
        subject: subject,
        html:body
    }
    return await transporter.sendMail(option);
}