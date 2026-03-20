import nodeMailer from "nodemailer";

const transporter = nodeMailer.createTransport({
    service: "smtp.gmail.com",
    port: 465,
    secure:true,
    auth: {
        user: "abhishekrajlakhera3579@gmail.com",
        pass:"sgzpcumksnpxoffr"
        // pass:"zfcbtsbwmbhvonhe"
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