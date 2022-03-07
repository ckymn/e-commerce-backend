const validate  = (schema) => (req,res,next) => {
    const { value, error } = schema.validate(req.body);
    if(error){
        const errorMessage = error.details?.map((detail) => detail.message).join(", ");
        return res.status(400).send({ error: errorMessage })
    }

    Object.assign(req,value);
    return next();
};

module.exports = validate;