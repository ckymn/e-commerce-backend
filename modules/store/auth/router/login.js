require('dotenv').config();
const Data = require("../model");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs");
const ApiError = require("../../../../errors/ApiError")

const route = async (req, res, next) => {
  try {
    let { email, password, username } = req.body;

    let store = await Data.findOne({ $or: [{ username }, { email }] });
    if(!store)
      return next(new ApiError("Store not found",404,[]));

    // remain date
    let remain_date = store.remain_date;
    let match = await bcrypt.compare(password, store.password);
    if(!match)
      return next(new ApiError("Password or email invalid",400,[]));

    let access_token = await jwt.sign({ 
      sub: store.username, 
      id: store.id,
      role: store.role,
      storeimg: store.storeimg
    }, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.JWT_ACCESS_TIME });

    return res.send({
      status: 200,
      message: "token was created",
      data: { access_token, remain_date },
    });
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
