const Data = require("../model");
const { sendEmail } = require("../../../../utils");
const { v4: uuidv4 } = require("uuid");
const ApiError = require("../../../../errors/ApiError")

const route = async (req, res, next) => {
  try {
    let { body, kuserData } = req;
    let _code = uuidv4();

    let u_code_data = await Data.findOneAndUpdate(
      { _id: kuserData.id },
      { $set: { code: _code } },
      { new: true }
    );
    if (!u_code_data)
      return next(new ApiError("Not Found!",204,[]))
    // send email
    let email = await sendEmail(body.email, "Vitrin Update Password", _code);
    if (email.status != 200)
        return next(new ApiError(email.message, email.status))
    return res.send({ status: 200, message: "Reset Code Send Success",data:[]});

  } catch (error) {
    if (error.name === "MongoError" && error.code === 11000) {
        next(new ApiError(error?.message, 422));
      }
      if (error.code === 27) {
        next(new ApiError("We Don't Have Any Data", 204, null));
      }
      next(new ApiError(error?.message))
  }
};

module.exports = route;
