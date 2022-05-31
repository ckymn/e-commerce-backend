const Data = require("../model");
const bcrypt = require("bcryptjs");
const ApiError = require("../../../../errors/ApiError");

const route = async (req, res, next) => {
    try {
        let { body, adminData } = req;

        let _data = await Data.findOne({ _id: adminData.id }).lean().exec();
        if(!_data)
            return next(new ApiError("Store not found",404,[]))

        let decoded = await bcrypt.compare(body.old_password,_data.password);
        if(!decoded){
            return next(new ApiError("Old Password incorrectly",400,[]));
        }else{
            if(body.new_password != body.new_password_again){
                return next(new ApiError("Didn't match new password and new again password",400,[]));
            }else{
                let encode = await bcrypt.hash(body.new_password,10);
                let data = await Data.findOneAndUpdate({ _id: adminData.id }, {$set: { password: encode }},{new: true});
                if(!data)
                    return next(new ApiError("Update password didn't match",404,[]));
                return res.send({
                  status: 200,
                  message: "Update Password Success",
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
}

module.exports = route