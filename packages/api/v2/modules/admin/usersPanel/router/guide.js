const Data = require("../model");
const ApiError = require("../../../../errors/ApiError");

const route = async (req, res, next) => {
  try {
    let { body } = req;
    
    let data = await Data.create({
      title: body.title,
      description: body.description,
      link: body.link,
    });
    return res.send({ status: 200, message: "Create How I Use Page Success",data});

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
