const Data = require("../model")
const bcrypt  = require("bcryptjs")
const ApiError = require("../../../../errors/ApiError")

const route = async (req, res, next) => {
    try {
        let { body , file  } = req;
        let { email, username, password } = body;

        let _result = await Data.findOne({ $or: [ { email }, { username }] });
        if(_result)
          return next(new ApiError("Email or Username already exist",409));

        const hash = await bcrypt.hashSync(password, 10);
        let data = await Data.create({
            ...body,
            location: {
                coordinates: [ parseFloat(body.long),parseFloat(body.lat) ]
            },
            store_open_hour: parseInt(body.store_open_hour),
            store_close_hour: parseInt(body.store_close_hour),
            password : hash,
        })
        return res.send({ status: 200, message: "user register success" })
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

module.exports = route;