const Data = require("../model")
const storage = require("../../../../uploads/images");
const ApiError = require("../../../../errors/ApiError");

const route = async (req,res,next) => {
    try {
        let { userData } = req;

        let data = await Data.find({ author: userData.id }).lean();
        if(data.length === 0)
            return res.send({ status: 400, messsage: "ads not found", data})
        return res.send({ status: 200, message: "advertisements success", data });

    } catch (error) {
        if (error.name === "MongoError" && error.code === 11000) {
          next(new ApiError(error?.message, 422));
        }
        if (error.code === 27) {
          next(new ApiError("We Don't Have Any Data", 204,null));
        }
        next(new ApiError(error?.message));
    }
}

module.exports = route; 