const Data = require("../model");
const bcrypt = require("bcryptjs");
const ApiError = require("../../../../errors/ApiError");

const route = async (req, res, next) => {
  try {
    let { body, kuserData } = req;

    let _data = await Data.findOne({ _id: kuserData.id }).lean().exec();
    let decoded = await bcrypt.compare(body.old_password,_data.password);
    if(!decoded){
      return next(new ApiError("Your old password incorrectly.",408, []));
    }else{
      if(body.new_password != body.new_again_password){
        return next(new ApiError("Don't match new_password and new_again_password incorrectly.",409, []));
      }else{
        let encode = await bcrypt.hash(body.new_password,10);
        await Data.findOneAndUpdate({ _id: kuserData.id }, {$set: { password: encode }},{new: true});
        return res.send({ status: 200, message: "Update Password Success"});
      }
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