const Data = require("../model")
const bcrypt  = require("bcryptjs")
const ApiError = require("../../../../errors/ApiError");

const route = async (req, res, next) => {
    try {
        let { file , body } = req;
        let { email, username, password  } = body;

        if(!file)
            return next(new ApiError("Please upload a file",400))
        let user = await Data.findOne({ $and: [ { email }, { username }] });
        if(user)
            return res.status(500).send({ status: false, message: "email or username already exists", user})
        let hash = await bcrypt.hash(password, 10);
        let data = await Data.create({
            ...req.body,
            password:hash,
        }).save();
        return res.status(200).send({ status: true, message: "admin register success",data})
    } catch (error) {
        if (error.name === "MongoError" && error.code === 11000) {
          next(new ApiError(error?.message, 422));
        }
        if (error.code === 27) {
          next(new ApiError("We Don't Have Any Data", 500));
        }
        next(new ApiError(error?.message, 500));
    }
}

module.exports = route