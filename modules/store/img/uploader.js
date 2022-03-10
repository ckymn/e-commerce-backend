const storage = require("../../../uploads/images");
const ApiError = require("../../../errors/ApiError");

const route = async (req, res, next) => {
  try {
    let { files } = req;
    if(!files)
      return next(new ApiError("Firstly Upload file",400))
    const str = [];
    for (i = 0; i < files.length; i++) {
      let data = await storage.Upload(files[i]);
      str.push(data);
    }
    return res
      .status(200)
      .send({ status: true, message: "Upload Images Success", str });
  } catch (error) {
    if (error.name === "MongoError" && error.code === 11000) {
      next(new ApiError(error?.message, 422));
    }
    if (error.code === 27) {
      next(new ApiError("We Don't Have Any Data", 500));
    }
    next(new ApiError(error?.message));
  }
};

module.exports = route;
