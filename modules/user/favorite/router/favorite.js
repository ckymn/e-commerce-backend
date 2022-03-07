const User = require("../../auth/model")
const Product = require("../../../store/products/model")
const ApiError = require("../../../../errors/ApiError")

const route = async (req,res,next) => {
    try {
        let { params, body , kuserData} = req;
        await User.findOne({ $and: [{_id: kuserData.id},{favorite_product:{$in: [params.id]}}]})
            .exec(async(err,data) => {
                if(!data){
                    let u_update = await User.updateOne({ _id: kuserData.id },
                      { $push: { favorite_product: params.id } }
                    );
                    if(u_update.matchedCount === 0)
                      return next(new ApiError("Update favorite product to user didn't match", 404))
                    let u_product = await Product.updateOne(
                      {
                        $and: [
                          { _id: params.id },
                          { favorite: { $nin: [kuserData.id] } },
                        ],
                      },
                      {
                        $push: {
                          favorite: kuserData.id,
                        },
                      }
                    );
                    if(u_product.matchedCount === 0)
                      return next(new ApiError("Update favorite on Product field didn't match ",404))
                    return res.status(200).send({ status: true, message: "Product Add Favorite Success "})
                }else{
                    let r_user = await User.updateOne({ _id: kuserData.id },
                      {
                        $pull: {
                          favorite_product: {
                            $in: [params.id],
                          },
                        },
                      }
                    );
                    if(r_user.matchedCount === 0)
                      return next(new ApiError("Remove favorite product to user didn't match", 404))
                    let r_product = await Product.updateOne(
                      {
                        $and: [
                          { _id: params.id },
                          { favorite: { $in: [kuserData.id] } },
                        ],
                      },
                      {
                        $pull: {
                          favorite: {
                            $in: [kuserData.id],
                          },
                        },
                      }
                    );
                    if(r_product.matchedCount === 0)
                      return next(new ApiError("Remove favorite product didn't match", 404))
                    return res.status(200).send({ status: true, message: "Product Delete Favorite Success "})
                }
            })
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