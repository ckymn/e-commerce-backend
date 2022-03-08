require("dotenv").config();
const Data = require("../model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs");
const ApiError = require("../../../../errors/ApiError");

const route = async (req, res, next) => {
   try {
        let { email , username, password } = req.body;

        let _admin = await Data.findOne({ $and: [ {email}, {username} ]});
        if(!_admin)
            return next(new ApiError("Admin not found",404));
        let match = await bcrypt.compare(password, _admin.password)
        if(!match)
            return next(new ApiError("Password or email invalid",400));
        let access_token = await jwt.sign({ id: _admin.id, role: _admin.role }, process.env.JWT_ACCESS_SECRET,{ expiresIn: process.env.JWT_ACCESS_TIME });
        return res.status(200).send({ status: true, message: "token was created", data:  access_token })
   } catch (error) {
    if (error.name === "MongoError" && error.code === 11000) {
      next(new ApiError(error?.message, 422));
    }
    if (error.code === 27) {
      next(new ApiError("We Don't Have Any Data", 500, null));
    }
    next(new ApiError(error?.message, 500));
   }
}
module.exports = route