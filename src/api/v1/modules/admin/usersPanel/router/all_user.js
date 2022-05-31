const Data = require("../../../user/auth/model")
const ApiError = require("../../../../errors/ApiError")

const route = async (req, res, next) => {
    try {
        let data = await Data.find({}).select("-password")
            .populate({ path: "follow", select: 'username -_id' })
            .populate({ path: "favorite_product", select:"title"})
            .populate({ path: "store_comment", select: "comment rate"})
            .populate({ path: "product_comment", select: "comment rate"})
            .lean().exec();
       
        if(!data)
            return res.send({ status: 404, message: "Not Found Store User", data})
            
        return res.send({ status: 200, message: "All Users Success", data });

    } catch (error) {
        if (error.name === "MongoError" && error.code === 11000) {
          next(new ApiError(error?.message, 422));
        }
        if (error.code === 27) {
          next(new ApiError("We Don't Have Any Data", 204, []));
        }
        next(new ApiError(error?.message, 500));
    }
}

module.exports = route