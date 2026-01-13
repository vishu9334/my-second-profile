export const globalErrorMiddleware = (err, req, res, next)=>{
    console.error('Error stack:', err.stack)
     const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success:false,
        message:err.message || 'Internal server Error'
    })
}