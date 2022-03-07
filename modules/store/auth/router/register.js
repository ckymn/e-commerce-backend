const Data = require("../model")
const bcrypt  = require("bcryptjs")
const storage = require("../../../../uploads/stores")
const ApiError = require("../../../../errors/ApiError")

const route = async (req, res, next) => {
    try {
        let { body , file  } = req;
        let { email, username, password ,password2 } = body;
        let _result = await Data.findOne({ $or: [ { email }, { username }] });
        if(_result)
          return next(new ApiError("Email or Username already exist",409));
        const hash = await bcrypt.hashSync(password, 10);
        if(password != password2)
          return next(new ApiError("passwords dont match",400))
        let data = await new Data({
            ...body,
            location: {
                coordinates: [ parseFloat(body.long),parseFloat(body.lat) ]
            },
            store_open_hour: parseInt(body.store_open_hour),
            store_close_hour: parseInt(body.store_close_hour),
            password : hash,
        }).save();
        // storage
        const str = await storage.Upload(file,data._id);
        if(str.status !== 200)
          return next(new ApiError(str.message,str.status))
        await data.set({
          storeimg: str.publicUrl
        })
        return res.status(200).send({ status: true, message: "user register success" })
    } catch (error) {
      if (error.name === "MongoError" && error.code === 11000) {
        next(new ApiError(error?.message, 422));
      }
      if (error.code === 27) {
        next(new ApiError("We Don't Have Any Data", 500, null));
      }
      next(new ApiError(error?.message));
      // !MONGODB VALIDATION YAP
    }
    
}

module.exports = route;