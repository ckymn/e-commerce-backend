const Data = require("../../auth/model")
const ApiError = require("../../../../errors/ApiError")

const route = async (req, res, next) => {
   try {
     let { userData } = req;
     let current_time = new Date();
     
     let data = await Data.findOne({ _id: userData.id }).lean();
     await Data.findOneAndUpdate({ _id: userData.id },
       {
         $inc: {
           "remain_date.time": -( data.updated_at.getDate() - data.remain_date.updated_at.getDate() ),
         },
       }
     )
       .populate({ path: "comment", select: "comment rate" })
       .populate({ path: "follow", select: "username" })
       .select("-password")
       .lean()
       .exec((err, data) => {
         if (!data)
           return next(new ApiError("Store not found",404,[]));

         return res.send({ status: 200, message: "Store data success", data });
       });
     } catch (error) {
          if (error.name === "MongoError" && error.code === 11000) {
          next(new ApiError(error?.message, 422));
          }
          if (error.code === 27) {
          next(new ApiError("We Don't Have Any Data", 204, []));
          }
          next(new ApiError(error?.message));
 }
}
module.exports = route
