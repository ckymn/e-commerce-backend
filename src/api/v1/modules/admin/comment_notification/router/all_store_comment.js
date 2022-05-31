const { Product_Comment } = require("../../../user/comment/model")
const ApiError = require("../../../../errors/ApiError")

const route = async (req, res) => { 
    try {
        let d_w = await Product_Comment.find({"is_approved": { $in: "wait" }}).lean();
        let d_n = await Product_Comment.find({"is_approved": { $in: "no" }}).lean();
        let d_y = await Product_Comment.find({"is_approved": { $in: "yes" }}).lean();

        if(!d_w.length && !d_n.length && !d_y.length)
            return next(new ApiError("All product comment not found",404,[]));  
        return res.send({
          status: 200,
          message: "All Store Comment Data success return",
          data: { d_w, d_n, d_y },
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
};

module.exports = route;