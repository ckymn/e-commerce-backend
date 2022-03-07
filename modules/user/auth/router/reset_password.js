const Data = require("../model");
const bcrypt = require("bcryptjs");
const ApiError = require("../../../../errors/ApiError");

const route = async (req, res, next) => {
    try {
        let { body, kuserData } = req;
        
        let _data = await Data.findOne({ _id: kuserData.id }).lean().exec();
        if(!_data)
            return next(new ApiError("Not Found",404))
        if(body.code != _data.code){
            return next(new ApiError("Don't Match Code. Try Again",400))
        }else{
            if(body.new_password != body.new_again_password){
                return next(new ApiError("New password don't match !",400))
            }else{
                let hash = await bcrypt.hash(body.new_password, 10);
                await Data.findOneAndUpdate({ _id: kuserData.id },
                  { $set: { password: hash, code: "" } },
                  { new: true }
                );
                return res.status(200).send({ status: true, message: "Reset Password Success"})
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