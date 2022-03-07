const ApiError = require("../../../../errors/ApiError");
const Data = require("../model")

const route = async (req, res, next) => {
    try {
        let { params,userData } = req.params;

        let s_product = await Data.findOne({ $and: [ { author: userData.id }, { _id: params.id } ] })
            .populate({ path: 'comments', 
                populate:{
                    path: 'author',
                    select: 'name surname'
                },
                options: { lean: true}
            })
            .populate({ path: 'star', select: 'rate' ,options: { lean: true}})
            .lean().exec();
        if(!s_product)
            return next(new ApiError("Single Product not found",404))
        return res.status(200).send({ status: true, message: "Single product search success", data: s_d })
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