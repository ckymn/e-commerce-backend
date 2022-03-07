const { Product_Comment , Store_Comment} = require("../../comment/model");
const Data = require("../../auth/model")

const route = async (req,res,next) => {
    try {
        let { kuserData } = req;
        let product_comments =  await Product_Comment.find({ $and: [ {author: kuserData.id},{is_approved: "yes"} ] })
            .populate({ 
                path: "product_id",
                select: 'product_name -_id',
                options: { lean: true }
            })
            .select("comment rate store_id")
        let store_comments =  await Store_Comment.find({ $and: [ {author: kuserData.id},{is_approved: "yes"} ] })
            .populate({
                path: "store_id",
                select: "storename -_id",
                options: {lean: true },
            })
            .select("comment rate store_id")
        let store_follow = await Data.findOne({ _id: kuserData.id })
            .populate({ path: "follow", select: "username" })
            .select("follow")
        
        return res.status(200).send({
          status: true,
          message: "Profile Page",
          data: {
            product_comments,
            // store_comments,
            store_follow,
          },
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
};

module.exports = route;