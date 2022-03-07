const Data = require("../../auth/model")
const ApiError = require("../../../../errors/ApiError")

const route = async (req, res, next) => {
   try {
     let { userData } = req;
     let current_time = new Date();
     let _data = await Data.findOne({ _id: userData.id }).lean();
     await Data.findOneAndUpdate({ _id: userData.id },
       {
         $inc: {
           "remain_date.time": -( _data.updated_at.getDate() - _data.remain_date.updated_at.getDate() ),
         },
       }
     )
       .populate({ path: "comment", select: "comment rate" })
       .populate({ path: "follow", select: "username" })
       .select("-password")
       .lean()
       .exec((err, data) => {
         if (!data)
           return next(new ApiError("Store not found",404));
         return res
           .status(200)
           .send({ status: true, message: "Store data success", data });
       });
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
