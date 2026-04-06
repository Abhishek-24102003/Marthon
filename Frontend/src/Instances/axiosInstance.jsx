import axios from "axios"
 export const axiosInstance =  axios.create({
      baseURL: "https://marthon.onrender.com/api",
    //  baseURL:"http://localhost:3000/api",
     withCredentials:true
})

