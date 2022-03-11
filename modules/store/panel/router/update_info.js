const ApiError = require("../../../../errors/ApiError");
const Data = require("../../auth/model")

const route = async (req, res, next) => {
    try {
        let { id } = req.userData;
        let { name, surname, email, username } = req.body;
        
        let data = await Data.findOneAndUpdate(
          { _id: id },
          { $set: { name, surname, email } },
          { new: true }
        )
        if(!data)
            return next(new ApiError("Store update not found",404));
        return res.send({ status: 200, message: "Seller Information Update success", data })
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