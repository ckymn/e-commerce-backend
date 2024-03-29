const Data = require("../../../store/auth/model");
const { sendEmail } = require("../../../../utils");
const ApiError = require("../../../../errors/ApiError");

const route = async (req, res,next) => {
  try {
    let { id } = req.params;

    await Data.findOneAndRemove({ _id: id })
      .lean().exec(async (err, data) => {
        if (!data)
          return next(new ApiError("Store delte not found",404,data));
        let _email = await sendEmail( data.email, " VitrinInt ", " Your Store Was Delete by Admin  ");
        if (!_email)
          return next(new ApiError(_email.message,_email.status,[]));
        return res.send({
          status: 200,
          message: "get Delete Store change success",
          data,
        });
      });
  } catch (error) {
    if (error.name === "MongoError" && error.code === 11000) {
      next(new ApiError(error?.message, 422));
    }
    if (error.code === 27) {
      next(new ApiError("We Don't Have Any Data", 204, []));
    }
    next(new ApiError(error?.message, 500));
  }
  
};

module.exports = route;