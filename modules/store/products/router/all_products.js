const ApiError = require("../../../../errors/ApiError");
const Data = require("../model")

const route = async (req, res, next) => {
    try {
        let { id } = req.userData;

        let d_w = await Data.find({ $and: [ { author: id },{"is_approved": { $in: "wait"}} ] }).lean();
        let d_n = await Data.find({ $and: [ { author: id },{"is_approved": { $in: "no"}} ] }).lean();
        let d_y = await Data.find({ $and: [{ author: id }, { is_approved: { $in: "yes" } }] })
          .populate({
            path: "comments",
            select: "comment rate author_name -_id",
            options: { lean: true },
          })
          .populate({ 
            path: "star", 
            select: "rate -_id", 
            options: { lean: true } 
          })
          .lean()
       
        if(!d_w.length && !d_n.length && !d_y.length)
          return next(new ApiError("All Product not found",404));
        return res.send({ status: 200, message: "All Product status here", data: { d_w, d_n, d_y } })
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