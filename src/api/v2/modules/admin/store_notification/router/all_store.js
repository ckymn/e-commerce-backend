const Data = require("../../../store/auth/model");
const ApiError = require("../../../../errors/ApiError")

const route = async (req,res,next) => {
    try {
        let d_w = await Data.find({"is_approved": { $in: "wait" }}).lean();
        let d_n = await Data.find({"is_approved": { $in: "not" }}).lean();
        let d_y = await Data.find({"is_approved": { $in: "yes" }}).lean();
        if(!d_w)
            return next(new ApiError("All store notification not found",404,[]));
        return res.send({
          status: 200,
          message: "All Store Data success return",
          data: { d_w, d_n, d_y },
        });
    } catch (error) {
        if (error.name === "MongoError" && error.code === 11000) {
          next(new ApiError(error?.message, 422));
        }
        if (error.code === 27) {
          next(new ApiError("We Don't Have Any Data", 204, []));
        }
        next(new ApiError(error?.message, 500));
    }
};

module.exports = route;