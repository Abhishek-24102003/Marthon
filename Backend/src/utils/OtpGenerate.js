
export const GenerateNewOtp = async () => {    
      const otpNumber = Math.floor(1000 + Math.random() * 999);
      const otp = {
        otpNumber,
        isExpired: Date.now() + 5 * 60 * 1000,
      }
    return otp
}