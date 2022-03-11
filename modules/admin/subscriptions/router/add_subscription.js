const Data = require("../model");
const ApiError = require("../../../../errors/ApiError")

const route = async (req, res, next) => {
    try {
        let { body, files, adminData } = req;
        let data = await Data.create({ ...body });

        return res
          .status(200)
          .send({ status: true, message: "Subscribe Data success", data });
    } catch (error) {
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