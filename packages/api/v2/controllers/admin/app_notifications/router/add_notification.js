const Data = require("../model");
const User = require("../../../user/auth/model");
const { firebase_ntf } = require("../../../../utils");
const ApiError = require("../../../../errors/ApiError");

const route = async (req, res, next) => {
  try {
    let { body } = req;

    let user = await User.find({
      $and: [
        { country: body.country },
        { city: body.city },
        { language: body.language },
      ],
      $expr: { $gt: [{ $strLenCP: "$registration_token" }, 40] },
    });
    // firebase registration token
    const registrationTokens = [];
    user.filter((i) => {
      registrationTokens.push(i.registration_token);
    });
    const message = {
      notification: {
        title: body.title,
        body: body.description,
      },
      tokens: registrationTokens,
    };
    let msg = await firebase_ntf(message, registrationTokens);

    if (msg.data[0].success === false)
      return next(
        new ApiError("Create app notification message didn't work", 400, [])
      );
    let data = await new Data({ ...body }).save();
    if (!data)
      return next(
        new ApiError("Create App Notification data didn't work", 400, [])
      );

    return res.send({
      status: 200,
      message: msg.message,
      data,
    });
  } catch (error) {
    if (error.name === "MongoError" && error.code === 11000) {
      next(new ApiError(error?.message, 422));
    }
    if (error.code === 27) {
      next(new ApiError("We Don't Have Any Data", 204, []));
    }
    next(new ApiError(error?.message));
  }
};

module.exports = route;
