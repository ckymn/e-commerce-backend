const { Product_Star } = require("../model")
const Product = require("../../../store/products/model")
const ApiError = require("../../../../errors/ApiError")

const route = async( req,res,next) => {
    try {
        let { body ,kuserData , params} = req;
        let store = await Product.findOne({ _id: params.id });
        
        await Product_Star.findOne({ $and:[{product_id: params.id},{author: kuserData.id}] })
            .lean().exec(async(err,data) => {
                if(!data){
                    await Product_Star.create({
                        rate: body.rate,
                        author: kuserData.id,
                        product_id: params.id,
                        store_id: store.author,
                    },async (err,data) => {
                        if(err)
                            return next(new ApiError("Create product star error",400,null))
                        let p_data = await Product.findOneAndUpdate({ _id: params.id },
                            {
                                $push: {
                                    "star": data._id
                                }
                            }, { new: true })
                        if(!p_data)
                            return next(new ApiError("Product update star Not found!",404,null))
                        return res.send({ status: 200, message: "User to Product Comment Success", data })
                    })
                }
                return next(new ApiError("Product star already exist",200, data));
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