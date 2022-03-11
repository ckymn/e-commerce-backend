require("dotenv").config();
const Data = require("../model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs");
const ApiError = require("../../../../errors/ApiError");

const route = async (req, res, next) => {
   try {
        let { email , username, password } = req.body;

        let data = await Data.findOne({ $and: [ {email}, {username} ]});
        if(!data)
            return next(new ApiError("Admin not found",404,data));

        let match = await bcrypt.compare(password, data.password)
        if(!match)
            return next(new ApiError("Password or email invalid",400,[]));
        let access_token = await jwt.sign(
          { id: data.id, role: data.role, img: data.img },
          process.env.JWT_ACCESS_SECRET,
          { expiresIn: process.env.JWT_ACCESS_TIME }
        );
        return res.send({ status: 200, message: "token was created", data:  access_token })
   } catch (error) {
    if (error.name === "MongoError" && error.code === 11000) {
      next(new ApiError(error?.message, 422));
    }
    if (error.code === 27) {
      next(new ApiError("We Don't Have Any Data", 204, []));
    }
    next(new ApiError(error?.message));
   }
}
module.exports = route