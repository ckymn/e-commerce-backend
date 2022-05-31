require("dotenv").config();
const Data = require("../model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const ApiError = require("../../../../errors/ApiError");

const route = async (req, res, next) => {
  try {
    let { email, password, registration_token } = req.body;

    let user = await Data.findOne({ email });

    if (!user) return next(new ApiError("Invalid Credentials", 400, null));

    if (user && (await bcrypt.compare(password, user.password))) {
      await user.set({
        registration_token,
      });

      let access_token = await jwt.sign(
        {
          id: user.id,
          role: user.role,
          address: {
            country: user.country,
            city: user.city,
            district: user.district,
          },
          language: user.language,
        },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: process.env.JWT_ACCESS_TIME }
      );

      return res.send({
        status: 200,
        message: "token was created",
        data: access_token,
      });
    }
  } catch (error) {
    if (error.name === "MongoError" && error.code === 11000) {
      next(new ApiError(error?.message, 422));
    }
    if (error.code === 27) {
      next(new ApiError("We Don't Have Any Data", 204, null));
    }
    next(new ApiError(error?.message));
  }
};
module.exports = route;
