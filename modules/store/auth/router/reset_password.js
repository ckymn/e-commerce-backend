const Data = require("../model");
const bcrypt = require("bcryptjs");
const ApiError = require("../../../../errors/ApiError");

const route = async (req, res, next) => {
    try {
        let { body, userData } = req;
        
        let _data = await Data.findOne({ _id: userData.id }).lean().exec();
        if(!_data)
            return next(new ApiError("Store not found", 404));
        if(body.code != _data.code){
            return next(new ApiError("Don't match code. Try again",400));
        }else{
            if(body.new_password != body.new_again_password){
                return next(new ApiError("New password didn't match.Try again",400));
            }else{
                let hash = await bcrypt.hash(body.new_password, 10);
                let u_pas_data = await Data.findOneAndUpdate({ _id: userData.id }, {$set: { password: hash , code:"" }},{new: true})
                if(!u_pas_data)
                    return next(new ApiError("Store clean code and update password not found",404));
                return res.send({ status: 200, message: "Reset Password Success"})
            }
        }
    } catch (error) {
        if (error.name === "MongoError" && error.code === 11000) {
          next(new ApiError(error?.message, 422));
        }
        if (error.code === 27) {
          next(new ApiError("We Don't Have Any Data", 500, null));
        }
        next(new ApiError(error?.message));
    }
}

module.exports = route