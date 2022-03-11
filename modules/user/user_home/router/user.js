const ApiError = require("../../../../errors/ApiError");
const Data = require("../../auth/model")

const route = async (req, res, next) => {
   try {
     let { kuserData } = req;

     let _admin = await Data.findOne({ _id: kuserData.id })
       .populate({
         path: "product_comment",
         select: "comment rate product_id",
         populate:{
           path: "product_id",
           select: "title"
         }
       })
       .populate({ 
         path: "follow", 
         select: "username storename storeimg" 
       });
     if(!_admin)
          return next(new ApiError("User not found",404));
     return res.status(200).send({ status: true, message: "token was created", data:  _admin })
   } catch (error) {
    if (error.name === "MongoError" && error.code === 11000) {
      next(new ApiError(error?.message, 422));
    }
    if (error.code === 27) {
      next(new ApiError("We Don't Have Any Data", 204, null));
    }
    next(new ApiError(error?.message,500,null));
   }
}
module.exports = route