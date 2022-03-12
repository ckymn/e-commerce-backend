const Store = require("../../auth/model")
const Data = require("../model")
const ApiError = require("../../../../errors/ApiError")
const {sendEmailToVitrin} = require("../../../../utils")

const route = async (req, res, next) => {
    try {
        let { body , userData ,files} = req;
        
        let user = await Store.findOne({ _id: userData.id }).lean();
        if(!user)
          return next(new ApiError('Store not found',404,null));
        let data = await Data.create({ 
            ... body ,
            author: userData.id
        });

        let mail = await sendEmailToVitrin(
          "vitrininternational@gmail.com",
          ` Vitrin Advertisement Request by : ${userData.id}`,
          `author: http://${req.headers.host}/${userData.id}
           ads_which: ${body.ads_which} 
           ads_time: ${body.ads_time}
           ads_price: ${body.ads_price}
           email: ${user.email}
           phone: ${body.phone}`
        );
        if(mail != 200)
            return next(new ApiError(mail.message,mail.status));
        return res.send({
          status: 200,
          message: "Your advertisement request is success, ",
          data,
        });
    } catch (error) {
        console.log(error)
        if (error.name === "MongoError" && error.code === 11000) {
          next(new ApiError(error?.message, 422));
        }
        if (error.code === 27) {
          next(new ApiError("We Don't Have Any Data", 204,[]));
        }
        next(new ApiError(error?.message));
    }
}

module.exports = route