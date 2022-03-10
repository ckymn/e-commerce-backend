const storage = require("../../../uploads/images");
const { v4: uuidv4 } = require("uuid");
const ApiError = require("../../../errors/ApiError");

const route = async (req, res, next) => {
  try {
    let { files  } = req;
    let bucketname = process.env.BUCKET_IMAGES;
    for (i = 0; i < files.length; i++) {
      const str = await storage.Upload(files[i], bucketname);
      return res
        .status(200)
        .send({ status: true, message: "Upload Images Success", str });
    }
  } catch (error) {
    if (error.name === "MongoError" && error.code === 11000) {
      next(new ApiError(error?.message, 422));
    }
    if (error.code === 27) {
      next(new ApiError("We Don't Have Any Data", 500, null));
    }
    next(new ApiError(error?.message));
  }
};

module.exports = route;
