import nodeMailer from "nodemailer";

const transporter = nodeMailer.createTransport({
    service: "gmail",
    auth: {
        user: "abhishekrajlakhera101@gmail.com",
        // pass:"sgzpcumksnpxoffr"
        pass:"zfcbtsbwmbhvonhe"
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