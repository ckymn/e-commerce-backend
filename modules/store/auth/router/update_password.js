const Data = require("../model");
const bcrypt = require("bcryptjs");
const ApiError = require("../../../../errors/ApiError");

const route = async (req, res, next) => {
    try {
        let { body, userData } = req;
        let _data = await Data.findOne({ _id: userData.id }).lean().exec();
        if(!_data)
            return next(new ApiError("Store not found",404))

        let decoded = await bcrypt.compare(body.old_password,_data.password);
        if(!decoded){
            return next(new ApiError("Old Password incorrectly",401));
        }else{
            if(body.new_password != body.new_password_again){
                return next(new ApiError("Didn't match new password and new again password",400));
            }else{
                let encode = await bcrypt.hash(body.new_password,10);
                let u_data = await Data.findOneAndUpdate({ _id: userData.id }, {$set: { password: encode }},{new: true});
                if(!u_data)
                    return next(new ApiError("Update password didn't match",409));
                return res.status(200).send({ status: true, message: "Update Password Success"})
            }
        }
    } catch (error) {
        console.log(error)
        if (error.name === "MongoError" && error.code === 11000) {
          next(new ApiError(error?.message, 422));
        }
        if (error.code === 27) {
          next(new ApiError("We Don't Have Any Data", 500, null));
        }
        next(new ApiError(error?.message,500));
    }
}

module.exports = route