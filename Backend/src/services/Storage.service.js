import Imagekit from "imagekit";
const storageInstance = new Imagekit({
    publicKey: process.env.IK_PUB_KEY,
    privateKey: process.env.IK_PVT_KEY,
    urlEndpoint: process.env.IK_URL
});
export const UploadToStorage = async (file, fileName) => {
    try {
        return await storageInstance.upload({
            file,
            fileName,
            folder:"Marthon-shoe"
        })
    } catch (error) {
        console.log("Error at Storage upload",error);
        
    }
}
