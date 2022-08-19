const Data = require("../model");
const bcrypt  = require("bcryptjs");
const ApiError = require("../../../../errors/ApiError");

const route = async (req, res, next) => {
  try {
    let { body } = req;
    let { email, username, password  } = body;

    let user = await Data.findOne({ $and: [ { email }, { username }] });
    if(user)
      return res.send({ status: 404, message: "email or username already exists", user});
    let hash = await bcrypt.hash(password, 10);
    let data = await Data.create({
      ...req.body,
      password:hash,
      img: body.img ? body.img : "https://storage.googleapis.com/vitrin_images/WhatsApp%20Image%202022-03-05%20at%2018.37.57.jpeg"
    });
    return res.send({
      status: 200,
      message: "admin register success",
      data,
    });
  } catch (error) {
    if (error.name === "MongoError" && error.code === 11000) {
      next(new ApiError(error?.message, 422));
    }
    if (error.code === 27) {
      next(new ApiError("We Don't Have Any Data", 204, []));
    }
    next(new ApiError(error?.message));
  }
};

module.exports = route;