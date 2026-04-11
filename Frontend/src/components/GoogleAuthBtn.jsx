import React from 'react'
import { axiosInstance } from '../Instances/axiosInstance';

const GoogleAuthBtn = () => {
  return (
     <button
        onClick={async () => {
         try {
           window.location.href = axiosInstance.get("/auth/google")
         } catch (error) {
          console.log(error);
          
         }
          
        }}
        className="flex items-center justify-center gap-3 w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-100 transition"
      >
        <img
          src="https://developers.google.com/identity/images/g-logo.png"
          alt="Google"
          className="w-5 h-5"
        />

        <span className="text-gray-700 font-medium">Sign up with Google</span>
      </button> 
  )
}

export default GoogleAuthBtn
