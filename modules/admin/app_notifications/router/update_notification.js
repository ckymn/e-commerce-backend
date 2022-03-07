const Data = require("../model")
const ApiError = require("../../../../errors/ApiError")

const route = async (req, res, next) => {
    try {
        let { body , params } = req;

        await Data.updateone({ _id: params.id },
          {
            $set: {
              ...body,
            },
          }
        )
          .lean()
          .exec((err, data) => {
            if (!data)
                return next(new ApiError("Update app notification didn't match",409))
            return res
              .status(200)
              .send({
                status: true,
                message: "Update Application Notification success",
                data,
              });
          });
    } catch (error) {
        if (error.name === "MongoError" && error.code === 11000) {
          next(new ApiError(error?.message, 422));
        }
        if (error.code === 27) {
          next(new ApiError("We Don't Have Any Data", 500, null));
        }
        next(new ApiError(error?.message, 500));
    }
}

module.exports = route