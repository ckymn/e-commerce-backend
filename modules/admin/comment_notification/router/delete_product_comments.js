const { Product_Comment } = require("../../../user/comment/model")
const Product = require("../../../store/products/model")
const User = require("../../../user/auth/model")
const ApiError = require("../../../../errors/ApiError")

const route = async (req,res,next) => {
    try {
        let { params , body} = req;

        await Product_Comment.findOne({_id: params.id}).lean().exec(async(err,data) =>{
            if(!data)
                return next(new ApiError("Product find comment not found",404));
            await Product_Comment.findOneAndDelete({ _id: params.id }).lean().exec(async(err,data) => {
                if(data.deletedCount === 0)
                    return next(new ApiError("Update product comment didn't match",409));
                    await Product.updateOne({ _id: data.product_id },
                        {
                            $pull: {
                                comments: {
                                    $in: data._id
                                }
                            }
                        }
                    ).lean().exec(async(err,data) =>{
                        if(data.matchedCount === 0)
                            return next(new ApiError("Update product comment on Product didn't match",409));
                    })
                    await User.updateOne({ _id: data.author },
                        {
                            $pull: {
                                product_comment: {
                                    $in: data._id
                                }
                            }
                        }
                    ).lean().exec(async(err,data) =>{
                        if(data.matchedCount === 0)
                            return next(new ApiError("Update product comment on User didn't match",409));
                    })
            })
            return res.send({ status: 200, message: "Product Comments Changing by Admin success " })
        })
    } catch (error) {
        if (error.name === "MongoError" && error.code === 11000) {
          next(new ApiError(error?.message, 422));
        }
        if (error.code === 27) {
          next(new ApiError("We Don't Have Any Data", 500, null));
        }
        next(new ApiError(error?.message, 500));
    }
};

module.exports = route  