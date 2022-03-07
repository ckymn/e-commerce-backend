require("dotenv").config();
const Data = require("../model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const ApiError = require("../../../../errors/ApiError")

const route = async (req, res, next) => {
   try {
        let { email , username, password,registration_token } = req.body;
        const _user = await Data.findOneAndUpdate({ $or: [{ email }, { username }]},{
          $set:{
            registration_token
          }
        });
        if(!_user){
          return next( new ApiError("You have to signup",404))
        }else{
          let match = await bcrypt.compare(password, _user.password)
          if(!match)
              return next(new ApiError("Passwo prd or Email invalid",400));
          let access_token = await jwt.sign({ 
              id: _user.id,
              address: { 
                  country: _user.country,
                  city: _user.city,
                  district: _user.district
              },
              language: _user.language
          }, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.JWT_ACCESS_TIME });
          return res.status(200).send({ status: true, message: "token was created", data: access_token })
      }
   } catch (error) {
    if (error.name === "MongoError" && error.code === 11000) {
      next(new ApiError(error?.message, 422));
    }
    if (error.code === 27) {
      next(new ApiError("We Don't Have Any Data", 500, null));
    }
    next(new ApiError(error?.message))
  }
}
module.exports = route