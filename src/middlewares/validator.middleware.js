



const validatorMiddleware = (schema) => {
    return async (req, res, next) => {

        const valid = schema.validate(req.body , {abortEarly: false});

        if (valid?.error) {
            return res.status(400).json({error: valid.error});
        }

        return next();
    }
}


export default validatorMiddleware;