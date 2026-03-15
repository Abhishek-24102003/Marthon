import { sendmail } from "../services/mail.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const orderplaced = asyncHandler(async (req, res) => {
    let user = req.user;
    const {email}=user
    let mailsend = await sendmail(email, "Marthon Oredr status", `Dear ${user.userName}, Your OredrPlaced Successfully!`);
    res.status(200).json({
        success: true,
        message:" Your OredrPlaced Successfully!, check confirmation mail"
    })
})