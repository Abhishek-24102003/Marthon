import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { axiosInstance } from "../Instances/axiosInstance";
import { toast } from 'react-toastify';
import { useDispatch } from "react-redux";
import { addUser } from "../features/authSlice";
const Register = ({ setToggle }) => {
  const dispatch = useDispatch()
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  const onSubmit = async (data) => {
    try {
       setLoading(true)
      let res = await axiosInstance.post("/auth/register", data);
      if (res) {
        if (res.data.success) {
          //send mail 
        }
        toast.success(res.data.message);
        setOtpSent(true);
      }

    } catch (error) {
      toast.error("Error while register:");
    }
    finally {
      setLoading(false)
    }
  };
  //otp
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false)
  const [resendOtp, setresendOtp] = useState(false)
  const handleOtpsubmit = async () => {
    try {
     let res = await axiosInstance.post("/auth/verify-otp",{otp})
      if (res) {
         toast.success(res.data.message)
      reset()
        setOtpSent(false)
        dispatch(addUser(res.data.user))
      }
  } catch (error) {
    toast.error("Wrong otp please resend!")
      setOtp("")
      setresendOtp(true)
    }
    
  }
  const handleResendOtp = async () => {
    try {
    let res = await axiosInstance.post("/auth/resend-otp")
   return toast.success(res.data.message)
    } catch (error) {
      console.log("errro hai laude");
      
    toast.error("failed to resend otp")
  }
}
  return (
    <div className="relative z-10 w-full sm:h-auto sm:max-w-112.5 flex flex-col justify-center p-8 sm:p-10 bg-[#121212]/80 backdrop-blur-xl sm:border sm:border-white/10 sm:rounded-[2.5rem] shadow-2xl overflow-y-auto">
      {/* loader */}
      {loading ? <div className="bg-black/50 w-full absolute h-full flex items-center justify-center text-4xl top-1/2 translate-y-[-50%] left-0 text-white"><h1>Loading...</h1></div> : ""}
      {/* Header */}
      <div className="mb-8 text-left sm:text-center">
        <h2 className="text-4xl sm:text-3xl font-black tracking-tighter text-white uppercase italic leading-none">
          Create <br className="sm:hidden" />{" "}
          <span className="text-[#E0FF22]">Account.</span>
        </h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* UserName */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold tracking-[0.15em] text-gray-500 uppercase ml-1">
            User Name
          </label>
          <input
            type="text"
            {...register("userName", { required: "Username is required" })}
            className={`w-full px-5 py-3.5 bg-white/5 border rounded-2xl text-white placeholder:text-gray-600 focus:outline-none transition-all duration-300 ${
              errors.userName
                ? "border-red-500/50"
                : "border-white/5 focus:border-[#E0FF22] focus:bg-white/10"
            }`}
            placeholder="SneakerHead_01"
            autoComplete="userName"
          />
          {errors.userName && (
            <span className="text-[10px] text-red-500 ml-1">
              {errors.userName.message}
            </span>
          )}
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold tracking-[0.15em] text-gray-500 uppercase ml-1">
            Email Address
          </label>
          <input
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
            })}
            className={`w-full px-5 py-3.5 bg-white/5 border rounded-2xl text-white placeholder:text-gray-600 focus:outline-none transition-all duration-300 ${
              errors.email
                ? "border-red-500/50"
                : "border-white/5 focus:border-[#E0FF22] focus:bg-white/10"
            }`}
            placeholder="kick@future.com"
          />
          {errors.email && (
            <span className="text-[10px] text-red-500 ml-1">
              {errors.email.message}
            </span>
          )}
        </div>

        {/* Mobile */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold tracking-[0.15em] text-gray-500 uppercase ml-1">
            Mobile Number
          </label>
          <input
            type="tel"
            {...register("mobile", {
              required: "Mobile is required",
              minLength: { value: 10, message: "Enter valid number" },
            })}
            className={`w-full px-5 py-3.5 bg-white/5 border rounded-2xl text-white placeholder:text-gray-600 focus:outline-none transition-all duration-300 ${
              errors.mobile
                ? "border-red-500/50"
                : "border-white/5 focus:border-[#E0FF22] focus:bg-white/10"
            }`}
            placeholder="+91 234 567 890"
            autoComplete="mobile"
          />
          {errors.mobile && (
            <span className="text-[10px] text-red-500 ml-1">
              {errors.mobile.message}
            </span>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold tracking-[0.15em] text-gray-500 uppercase ml-1">
            Secure Password
          </label>
          <input
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 8, message: "Min 8 characters" },
            })}
            className={`w-full px-5 py-3.5 bg-white/5 border rounded-2xl text-white placeholder:text-gray-600 focus:outline-none transition-all duration-300 ${
              errors.password
                ? "border-red-500/50"
                : "border-white/5 focus:border-[#E0FF22] focus:bg-white/10"
            }`}
            placeholder="••••••••"
            autoComplete="new-password"
          />
          {errors.password && (
            <span className="text-[10px] text-red-500 ml-1">
              {errors.password.message}
            </span>
          )}
        </div>

        {/* Register Button */}
        <button
          type="submit"
          className="w-full py-5 mt-4 font-black tracking-widest text-black uppercase transition-all duration-300 bg-[#E0FF22] rounded-2xl hover:shadow-[0_0_30px_rgba(224,255,34,0.4)] active:scale-95 group flex items-center justify-center gap-2"
        >
          Join the Club
        </button>
      </form>
         
      {/* Sign up options
      <br />
      <button
        onClick={async () => {
         try {
           window.location.href = "http://localhost:3000/api/auth/google";
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
      </button> */}
       {otpSent?<div className=" text-white flex justify-center items-center gap-2 mt-10 ">
        <input className=" text-white border px-2 py-1 rounded" value={otp} onChange={(e)=>setOtp(e.target.value)} type="text" placeholder=" enter otp " />
        <button
        onClick={handleResendOtp}
        >ResendOtp</button>
        <button
          onClick={handleOtpsubmit}
          className=" px-4 py-2 bg-[#E0FF22] rounded text-black">Submit</button>
      </div>:""}
      {/* Footer */}
      <div className="mt-auto sm:mt-8 pt-6 border-t border-white/5 text-center">
        <p className="text-xs text-gray-500 tracking-wide">
          Already have an account?{" "}
          <button
            onClick={() => setToggle((prev) => !prev)}
            className="text-white font-bold hover:text-[#E0FF22] transition-colors underline underline-offset-4 decoration-white/10"
          >
            Sign In.
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;
