import { useForm } from "react-hook-form";
import { axiosInstance } from "../Instances/axiosInstance";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { addUser, setIsloading } from "../features/authSlice";
import {toast} from "react-toastify"
const Login = ({ setToggle }) => {
  const navigate = useNavigate();
  const disaptch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      let res = await axiosInstance.post("/auth/login", data);
      if (res) {
        disaptch(addUser(res.data.user));
        localStorage.setItem("User",JSON.stringify(res.data.user))
        disaptch(setIsloading(false))
        navigate("/homelayout");
      }
    } catch (error) {
      toast.error("Invalid credentials!!")
      
    }
  };
  const handleforgot = async () => {
    navigate("/forgotPassword")
  }

  return (
    <div className="relative z-10 w-full  sm:h-auto sm:max-w-105 flex flex-col justify-center p-8 sm:p-10 bg-[#121212]/80 backdrop-blur-xl sm:border sm:border-white/10 sm:rounded-[2.5rem] shadow-2xl">
      {/* Branding/Header */}
      <div className="mb-12 text-left sm:text-center">
        <h2 className="text-4xl sm:text-3xl font-black tracking-tighter text-white uppercase italic leading-none">
          Welcome <br className="sm:hidden" />{" "}
          <span className="text-[#E0FF22]">Back.</span>
        </h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Username Input */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold tracking-[0.15em] text-gray-500 uppercase ml-1">
            User Identity
          </label>
          <input
            type="text"
            {...register("userName", { required: "Username is required" })}
            className={`w-full px-5 py-4 bg-white/5 border rounded-2xl text-white placeholder:text-gray-600 focus:outline-none transition-all duration-300 ${
              errors.userName
                ? "border-red-500/50"
                : "border-white/5 focus:border-[#E0FF22] focus:bg-white/10"
            }`}
            placeholder="Username"
            autoComplete="userName"
          />
          {errors.userName && (
            <span className="text-[10px] text-red-500 font-medium ml-1">
              {errors.userName.message}
            </span>
          )}
        </div>

        {/* Password Input */}
        <div className="space-y-2">
          <div className="flex justify-between items-center ml-1">
            <label className="text-[10px] font-bold tracking-[0.15em] text-gray-500 uppercase">
              Secure Key
            </label>
            <button
              onClick={handleforgot}
              type="button"
              className="text-[10px] font-bold text-gray-600 hover:text-[#E0FF22] uppercase transition-colors hover:cursor-pointer"
            >
              Forgot?
            </button>
          </div>
          <input
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Min 6 characters" },
            })}
            className={`w-full px-5 py-4 bg-white/5 border rounded-2xl text-white placeholder:text-gray-600 focus:outline-none transition-all duration-300 ${
              errors.password
                ? "border-red-500/50"
                : "border-white/5 focus:border-[#E0FF22] focus:bg-white/10"
            }`}
            placeholder="••••••••"
            autoComplete="current-password"
          />
          {errors.password && (
            <span className="text-[10px] text-red-500 font-medium ml-1">
              {errors.password.message}
            </span>
          )}
        </div>

        {/* Action Button */}
        <button
          type="submit"
          className="w-full py-5 mt-4 font-black tracking-widest text-black uppercase transition-all duration-300 bg-[#E0FF22] rounded-2xl hover:shadow-[0_0_30px_rgba(224,255,34,0.4)] active:scale-95 flex items-center justify-center gap-2 group"
        >
          Sign In
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 transition-transform group-hover:translate-x-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </form>

      {/* Sign up options */}
          
      <div className="mt-auto sm:mt-10 pt-6 border-t border-white/5 text-center">
        <p className="text-xs text-gray-500 tracking-wide">
          Not a member yet?{" "}
          <button
            onClick={() => setToggle((prev) => !prev)}
            className="text-white font-bold hover:text-[#E0FF22] transition-colors underline underline-offset-4 decoration-white/10"
          >
            Join the Club.
          </button>
        </p>
      </div>


    </div>
  );
};

export default Login;
