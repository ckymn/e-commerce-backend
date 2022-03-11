const Data = require("../model");
const { sendEmail } = require("../../../../utils");
const { v4: uuidv4 } = require('uuid');
const ApiError = require("../../../../errors/ApiError");

const route = async (req, res, next) => {
    try {
        let { body, adminData } = req;
        let _code = uuidv4();

        let data = await Data.findOneAndUpdate({ _id: adminData.id },
          { $set: { code: _code } },
          { new: true }
        );
        if(!data)
            return next(new ApiError("admin not found",404,[]));
        let _email = await sendEmail(body.email,"Vitrin Update Password",_code);
        if(_email.status != 200){
            return next(new ApiError(_email.message,_email.status))
        }
        return res.send({ status: 200, message: "Reset Code Send Success",data})
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