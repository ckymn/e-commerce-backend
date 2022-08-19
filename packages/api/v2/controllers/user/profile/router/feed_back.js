const { sendEmailToVitrin} = require("../../../../utils");
const ApiError = require("../../../../errors/ApiError");

const route = async (req,res,next) => {
  try {
    let { body, kuserData } = req;
    let { email, feed_back } = body;

    let _email = await sendEmailToVitrin(email,`send by ${kuserData.sub}`,feed_back);
    if(_email.status != 200)
      return next(new ApiError(_email.message,_email.status, null));
    return res.status(_email.status).send({ status: false, message: _email.message});
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