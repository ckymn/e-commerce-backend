const Data = require("../model");
const Store = require("../../auth/model")
const ApiError = require("../../../../errors/ApiError")

const route = async (req, res, next) => {
    try {
        let { body , userData} = req;
        
        let _data = await Store.findOne({ _id: userData.id }).lean();
        if(!_data)
            return next(new ApiError("Store not found",404,_data,[]))

        function makeid(length) {
            var result           = '';
            var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var charactersLength = characters.length;
            for ( var i = 0; i < length; i++ ) {
                result += characters.charAt(Math.floor(Math.random() * 
            charactersLength));
            }
            return result
        }
        const productName = `${body.title}-${makeid(10)}`
        let data = await Data.create({
            ...body,
            title: productName,
            location: {
                coordinates: [ parseFloat(_data.location.coordinates[0]),parseFloat(_data.location.coordinates[1]) ]
            },
            categories:body.categories,
            variants: body.variants,
            futures: body.futures,
            country: _data.storecountry,
            city: _data.storecity, 
            district: _data.storedistrict,
            language: _data.storelanguage,
            author: userData.id,
            phone: _data.phone,
            store_open_hour: _data.store_open_hour,
            store_close_hour: _data.store_close_hour,
        });
        return res.send({ status: 200, message: "Add Product worked",data})
    } catch (error) {
        console.log(error)
        if (error.name === "MongoError" && error.code === 11000) {
          return next(new ApiError(error?.message, 422));
        }
        if (error.code === 27) {
          return next(new ApiError("We Don't Have Any Data", 204, []));
        }
        return next(new ApiError(error?.message));
    }
}

module.exports = route