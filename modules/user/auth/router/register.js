const Data = require("../model")
const bcrypt  = require("bcryptjs")
const ApiError = require("../../../../errors/ApiError")

const route = async (req, res, next) => {
    try {
      let { body } = req;
      let { email, username, password} = body;
      let _data = await Data.findOne({ $or: [{ email }, { username }] });
      if (_data)
        return next(new ApiError("Email and Username already exists...",200,null))
      const hash = await bcrypt.hash(password, 10);
      let _user = await new Data({
        ...body,
        location: {
          coordinates: [parseFloat(body.long), parseFloat(body.lat)],
        },
        password: hash,
      });
      await _user.save();
      return res
        .status(200)
        .send({ status: true, message: "user register success" });

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