const { Store_Star } = require("../model")
const Store = require("../../../store/auth/model")
const ApiError = require("../../../../errors/ApiError")

const route = async( req,res,next) => {
    try {
        let { body ,kuserData , params} = req;
        await Store_Star.findOneAndRemove({ $and:[{ product_id: params.id }, { author: kuserData.id }] })
            .lean().exec(async(err,data) => {
                if(!data)
                    return next(new ApiError("Delete store star Not Found",404,[]));
                let p_data = await Store.updateOne({ _id: params.id },
                    {
                        $pull: {
                            star:{
                                $in: data._id
                            }
                        }
                    })
                if(p_data.matchedCount === 0)
                    return next(new ApiError("Update store star field didn't match",404,[]))
                return res.send({ status: 200, message: "User Delete Store Comment Success",data})
            })
        
    } catch (error) {
        if (error.name === "MongoError" && error.code === 11000) {
          next(new ApiError(error?.message, 422));
        }
        if (error.code === 27) {
          next(new ApiError("We Don't Have Any Data", 204, null));
        }
        next(new ApiError(error?.message));
    }
}

module.exports = route