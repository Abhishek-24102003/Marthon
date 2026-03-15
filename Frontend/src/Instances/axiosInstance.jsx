import axios from "axios"
 export const axiosInstance =  axios.create({
     baseURL: "https://marthon.onrender.com/api",
     withCredentials:true
})

