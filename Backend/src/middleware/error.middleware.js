export const errorMiddleware = (err, req, res, next) => {
     console.log("error-->Error middleware",err);
     
    // If headers are already sent, let the default Express error handler take over
    if (res.headersSent) {
        return next(err);
    }
    
    let statusCode = err.statusCode || 500;
    return res.status(statusCode).json({
        message:err.message|| "Internal server errror",
        success:false
    })
}