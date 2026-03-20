import axios from "axios"
 export const axiosInstance =  axios.create({
     baseURL: "https://marthon.vercel.app/",
     withCredentials:true
})

