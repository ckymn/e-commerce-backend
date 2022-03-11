const Data = require("../../../store/auth/model")
const ApiError  = require("../../../../errors/ApiError")

const route = async (req, res, next) => {
    try {
        
        let data = await Data.find({}).select("-password -search_count -location_search_count -wp_msg_count");
        if(!data){
            return res.send({ status: 404, message: "Not Found Store User", data})
        }else{
            return res.send({status: 200, message: "All Store Success", data })
        }
    } catch (error) {
        if (error.name === "MongoError" && error.code === 11000) {
          next(new ApiError(error?.message, 422));
        }
        if (error.code === 27) {
          next(new ApiError("We Don't Have Any Data", 204,[]));
        }
        next(new ApiError(error?.message));
    }
}

module.exports = route