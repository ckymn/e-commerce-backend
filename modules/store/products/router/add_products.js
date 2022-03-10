const Data = require("../model");
const Store = require("../../auth/model")
const ApiError = require("../../../../errors/ApiError")

const route = async (req, res, next) => {
    try {
        let { body , userData} = req;
        
        let _data = await Store.findOne({ _id: userData.id }).lean();
        if(!_data)
            return next(new ApiError("Store not found",404))
        let p_create = await new Data({
            ...body,
            location: {
                coordinates: [ parseFloat(body.long),parseFloat(body.lat) ]
            },
            categories:body.categories,
            variants: body.variants,
            futures: body.futures,
            country: _data.storecountry,
            city: _data.storecity, 
            district: _data.storedistrict,
            language: _data.storelanguage,
            author: userData.id,
            phone: _data.phone
        }).save();
        if(!p_create)
            return next(new ApiError("Product create doesn't work",400))
        return res.status(200).send({ status: true, message: "Add Product worked"})
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