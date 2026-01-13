export const validate = (schema) => async (req, res, next) =>{
    try {
        const parseBody = await schema.parseAsync(req.body);
        req.body = parseBody;
        next();
    } catch (err) {

        if (err.name === "ZodError") {
            const errors = err.issues.map(issue => issue.message);

            return res.status(400).json({
                success: false,
                errors
            });
        }

        return res.status(500).json({
            success: false,
            message: err.message || "Internal Server Error"
        });
    }
};