const Data = require("../model");
const bcrypt = require("bcryptjs");
const ApiError = require("../../../../errors/ApiError");

const route = async (req, res, next) => {
    try {
        let { body, kuserData } = req;
        let _data = await Data.findOne({ _id: kuserData.id }).lean().exec();
        if(!_data)
            return next(new ApiError("Not Found",404))
        
        let decoded = await bcrypt.compare(body.old_password,_data.password);
        if(!decoded){
            return next(new ApiError("Your old password incorrectly.",400))
        }else{
            if(body.new_password != body.new_again_password){
                return next(new ApiError("Don't match new_password and new_again_password incorrectly.",400))
            }else{
                let encode = await bcrypt.hash(body.new_password,10);
                let u_data = await Data.findOneAndUpdate({ _id: kuserData.id }, {$set: { password: encode }},{new: true});
                if(!u_data)
                    return next(new ApiError("Update Password Don't Match Failed",404))
                return res.status(200).send({ status: true, message: "Update Password Success"})
            }
        }
    } catch (error) {
        if (error.name === "MongoError" && error.code === 11000) {
            next(new ApiError(error?.message, 422));
          }
          if (error.code === 27) {
            next(new ApiError("We Don't Have Any Data", 500, null));
          }
          next(new ApiError(error?.message))
    }
}

module.exports = route