// import { ApiError } from "../utils/ApiError.js";
// export const validate = (schema) => (err, req, res, next) =>{
//     const result = schema.safeParse(req.body);
//     if(!result.success){
//         const errors = result.error.issues.map(err=>({
//             field: err.path.join('.'),
//             message: err.message
//         }));
//         return next( new ApiError(400, "Validation Error", errors));

//     }
//     req.body = result.data;
//     next()
// }

export const validate = (schema) => async (req, res, next) =>{
    try{
        const parseBody = await schema.parseAsync(req.body);
        req.body = parseBody;
        next();

    }catch(err){
        const message = err.errors[0].message;
        console.log(message);
        res.status(400).json({msg: message})
    }
}
