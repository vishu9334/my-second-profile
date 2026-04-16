export const globalErrorMiddleware = (err, req, res, next)=>{
    console.error('Error stack:', err.stack)
     let statusCode = err.statusCode || 500;
     let message = err.message || "Internal server Error";
     if (err.code === "LIMIT_FILE_SIZE") {
       statusCode = 413;
       message = "File exceeds size limit (8MB)";
     }
    res.status(statusCode).json({
        success:false,
        message
    })
}