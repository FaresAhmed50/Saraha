



const validatorMiddleware = (schema) => {
    return async (req, res, next) => {

        let validationError = [];

        for (const key of Object.keys(schema)) {
            const result = schema[key].validate(req[key] , {abortEarly: false});

            if (result?.error) {
                validationError.push(result.error.details);
            }
        }

        if(validationError.length ){
            return res.status(400).send({ massage : "validation Error" , error: validationError});
        }

        return next();
    }
}


export default validatorMiddleware;