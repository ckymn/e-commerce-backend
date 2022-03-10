const Data = require("../../../store/auth/model")
const ApiError  = require("../../../../errors/ApiError")

const route = async (req, res, next) => {
    try {
        let data = await Data.find({}).select("-password").lean();
        if(!data){
            return res.status(404).send({ status: false, message: "Not Found Store User", data})
        }else{
            return res.status(200).send({status: true, message: "All Store Success", data })
        }
    } catch (error) {
        if (error.name === "MongoError" && error.code === 11000) {
          next(new ApiError(error?.message, 422));
        }
        if (error.code === 27) {
          next(new ApiError("We Don't Have Any Data", 500));
        }
        next(new ApiError(error?.message, 500));
    }
}

module.exports = route