const { Store_Comment } = require("../../../user/comment/model")
const ApiError = require("../../../../errors/ApiError")

const route = async (req, res) => { 
    try {
        let d_w = await Store_Comment.find({}).lean();
        let d_n = await Store_Comment.find({}).lean();
        let d_y = await Store_Comment.find({}).lean();

        if(!d_w.length && !d_n.length && !d_y.length)
            return next(new ApiError("All product comment not found",404));
        return res
          .status(200)
          .send({
            status: true,
            message: "All Product Comment Data success return",
            data: { d_w, d_n, d_y },
          });
    } catch (error) {
        if (error.name === "MongoError" && error.code === 11000) {
          next(new ApiError(error?.message, 422));
        }
        if (error.code === 27) {
          next(new ApiError("We Don't Have Any Data", 204, null));
        }
        next(new ApiError(error?.message, 500)); 
    }
};

module.exports = route;