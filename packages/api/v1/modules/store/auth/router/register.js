const Data = require("../model");
const bcrypt  = require("bcryptjs");
const ApiError = require("../../../../errors/ApiError");
const { sendEmail } = require("../../../../utils");

const route = async (req, res, next) => {
  try {
    let { body , file  } = req;
    let { email, username, password } = body;

    let store = await Data.findOne({ $or: [ { email }, { username }] });
    if(store)
      return next(new ApiError("Email or Username already exist", 409,[]));

    const hash = await bcrypt.hashSync(password, 10);
    await Data.create({
      ...body,
      location: {
        coordinates: [parseFloat(body.long), parseFloat(body.lat)],
      },
      store_open_hour: parseInt(body.store_open_hour),
      store_close_hour: parseInt(body.store_close_hour),
      password: hash,
    });
    let _email = await sendEmail(body.email,"Your request has been received and will be returned as soon as possible.");
    if(_email.status != 200)
      return next(new ApiError(`Store register success but ${_email.message}`,_email.status,[]));
    return res.send({
      status: 200,
      message: "store register success",
    });
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