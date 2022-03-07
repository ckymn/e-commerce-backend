const Data = require("../../login/model")
const ApiError = require("../../../../errors/ApiError")

const route = async (req, res, next) => {
   try {
     let {adminData} = req;

     await Data.findOne({ _id: adminData.id }).lean().exec((err,data) => {
          if(!data)
               return next(new ApiError("Admin not found", 404));
          return res.status(200).send({ status: true, message: "token was created", data })
     });
   } catch (error) {
     if (error.name === "MongoError" && error.code === 11000) {
       next(new ApiError(error?.message, 422));
     }
     if (error.code === 27) {
       next(new ApiError("We Don't Have Any Data", 500, null));
     }
     next(new ApiError(error?.message, 500));
   }
}
module.exports = route