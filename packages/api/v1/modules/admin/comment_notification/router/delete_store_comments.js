const { Store_Comment } = require("../../../user/comment/model");
const Store = require("../../../store/auth/model");
const User = require("../../../user/auth/model");


const route = async (req,res,next) => {
  try {
    let { params } = req;
    await Store_Comment.findOne({ _id: params.id }).lean().exec(async(err,data) =>{
      if(!data)
        return next(new ApiError("Store find comment not found",404));  
      await Product_Comment.findOneAndDelete({ _id: params.id }).lean().exec(async(err,data) => {
        if(!data)
          return next(new ApiError("Update store comment didn't match",404,data));
        await Store.updateOne({ _id: data.store_id },
          {
            $pull: {
              comment: {
                $in: data._id
              }
            }
          }
        );
        await User.updateOne({ _id: data.author },
          {
            $pull: {
              store_comment: {
                $in: data._id
              }
            }
          }
        );
      });
      return res.send({ status: 200, message: "Store Comments Changing by Admin success " });
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