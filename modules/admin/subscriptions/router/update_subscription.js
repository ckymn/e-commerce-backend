const Data = require("../model");
const ApiError = require("../../../../errors/ApiError")


const route = async (req, res, next) => {
    try {
        let { files , params, body } = req;

        let data =  await Data.findOneAndUpdate({_id: params.id},{
            $set: { ...body  },
        })
        if(!data)
            return res.status(400).send({ status: false, message: "subscription not found",data})
        return res.send({ status: 200, message: "Update Subscribe success", data})
    } catch (error) {
        console.log(error)
        if (error.name === "MongoError" && error.code === 11000) {
          next(new ApiError(error?.message, 422));
        }
        if (error.code === 27) {
          next(new ApiError("We Don't Have Any Data", 204, null));
        }
        next(new ApiError(error?.message, 500));
    }
}

module.exports = route