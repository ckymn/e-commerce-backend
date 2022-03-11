const Data = require("../model")
const Store = require("../../auth/model");
const ApiError = require("../../../../errors/ApiError")

const route = async (req, res, next) => {
    try {
        let { body, userData } = req;
    
        let store = await Store.findOne({ _id: userData.id }).lean();
        if(!store)
            return next(new ApiError("Store not found", 404));
        let _data = await Data.create({
            ...body,
            author: userData.id,
            author_img: store.storeimg,
            location:{
                coordinates: [parseFloat(store.location.coordinates[0]),parseFloat(store.location.coordinates[1])]
            },
        })
        return res.send({ status: 200, message: "Add Store story worked", data: _data })
    } catch (error) {
        console.log(error)
        if (error.name === "MongoError" && error.code === 11000) {
          next(new ApiError(error?.message, 422));
        }
        if (error.code === 27) {
          next(new ApiError("We Don't Have Any Data", 500 ));
        }
        next(new ApiError(error?.message));
    }
}

module.exports = route;