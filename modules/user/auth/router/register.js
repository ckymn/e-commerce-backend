const Data = require("../model")
const bcrypt  = require("bcryptjs")
const ApiError = require("../../../../errors/ApiError")

const route = async (req, res, next) => {
    try {
      let { body } = req;
      let { email, password} = body;

      let _data = await Data.findOne({ email });
      if (_data)
        return next(new ApiError("Email and Username already exists...",409,null))
      const hash = await bcrypt.hash(password, 10);
      let _user = await new Data({
        ...body,
        location: {
          coordinates: [parseFloat(body.long), parseFloat(body.lat)],
        },
        password: hash,
      });
      await _user.save();
      return res.send({ status: 200, message: "user register success" });

    } catch (error) {
      if (error.name === "MongoError" && error.code === 11000) {
        next(new ApiError(error?.message, 422));
      }
      if (error.code === 27) {
        next(new ApiError("We Don't Have Any Data", 204, null));
      }
      next(new ApiError(error?.message));
    }
}

module.exports = route