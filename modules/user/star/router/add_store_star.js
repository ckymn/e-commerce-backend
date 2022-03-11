const { Store_Star } = require("../model")
const Store = require("../../../store/auth/model")
const ApiError = require("../../../../errors/ApiError")

const route = async( req,res,next) => {
    try {
        let { body ,kuserData , params} = req;
        await Store_Star.findOne({ $and:[{store_id: params.id},{author: kuserData.id}] })
            .lean().exec(async(err,data) => {
                if(!data){
                    await Store_Star.create({
                        rate: body.rate,
                        author: kuserData.id,
                        store_id: params.id
                    },async (err,data) => {
                        if(err)
                            return next(new ApiError("Create star store !",400,[]))
                        let s_data = await Store.findOneAndUpdate({ _id: params.id },
                            {
                                $push: {
                                    "star": data._id
                                }
                            }, { new: true })
                        if(!s_data) 
                            return next(new ApiError("Update store star Not found !",404,[]))
                    })
                    return res.send({ status: 200, message: "User to Store Comment Success" ,data})
                }
                return next(new ApiError("Store star already exist !",200, data))
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