require("dotenv").config();
const Data = require("../model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const ApiError = require("../../../../errors/ApiError")

const route = async (req, res, next) => {
   try {
        let { email, password,registration_token } = req.body;

        let data = await Data.findOneAndUpdate({ email },{
          $set:{
            registration_token
          }
        });
        if(!data){
          return next( new ApiError("You have to signup",404,null))
        }else{
          let match = await bcrypt.compare(password, data.password)
          if(!match)
              return next(new ApiError("Password or Email invalid",400,null));
          let access_token = await jwt.sign({ 
              id: data.id,
              role: data.role,
              address: { 
                  country: data.country,
                  city: data.city,
                  district: data.district
              },
              language: data.language
          }, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.JWT_ACCESS_TIME });
          // return res.send({
          //   status: 200,
          //   message: "token was created",
          //   data: {
          //     access_token: generateAccessToken(user),
          //     refresh_token: generateRefreshToken(user),
          //   },
          // });
          return res.send({ status: 200, message: "token was created", data: access_token })
      }
   } catch (error) {
    if (error.name === "MongoError" && error.code === 11000) {
      next(new ApiError(error?.message, 422));
    }
    if (error.code === 27) {
      next(new ApiError("We Don't Have Any Data", 204, null));
    }
    next(new ApiError(error?.message))
  }
}
module.exports = route