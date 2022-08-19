const Data = require("../model");
const bcrypt = require("bcryptjs");
const ApiError = require("../../../../errors/ApiError");

const route = async (req, res, next) => {
  try {
    let { body, adminData } = req;
        
    let _data = await Data.findOne({ _id: adminData.id }).lean().exec();
    if(!_data)
      return next(new ApiError("Store not found", 404,[]));

    if(body.code != _data.code){
      return next(new ApiError("Don't match code. Try again",400,[]));
    }else{
      if(body.new_password != body.new_password_again){
        return next(new ApiError("New password didn't match.Try again",400,[]));
      }else{
        let hash = await bcrypt.hash(body.new_password, 10);
        let data = await Data.findOneAndUpdate(
          { _id: adminData.id },
          { $set: { password: hash, code: "" } },
          { new: true }
        );
        if(!data)
          return next(new ApiError("Store not found",404,[]));
        return res.send({
          status: 200,
          message: "Reset Password Success",
          data,
        });
      }
    }
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