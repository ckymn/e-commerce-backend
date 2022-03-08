const Data = require("../model")
const storage = require("../../../../uploads/images")
const { v4: uuidv4 } = require("uuid")
const ApiError = require("../../../../errors/ApiError")

const route = async (req, res, next) => {
    try {
      let { file, files, userData } = req;

      if(files.length === 1){
        let data = await Data.create({ author: userData.id });
        if(!data)
          return next(new ApiError("Create store image didn't work",400));
        const str = await storage.Upload(file, data._id);
        if (str.status !== 200)
          return next(new ApiError(str.message,str.status));
        let u_img = await Data.updateOne({ _id: data.id },
          {
            $set: {
              url: str.publicUrl,
            },
          }
        );
        if(u_img.matchedCount === 0)
          return next(new ApiError("Image update didn't update",404));
        return res
          .status(200)
          .send({ status: true, message: "Upload Images Success", data });
      
      }
      if (files.length > 1) {
        files.map(async (i) => {
          let data = await Data.create({ author: userData.id });
          if(!data)
            return next(new ApiError("Create store images didn't work",400));
          const str = await storage.Upload(i, data._id);
          let u_img = await Data.updateOne({ _id: data._id },
            {
              $set: {
                url: str.publicUrl,
              },
            }
          );
          if(u_img.matchedCount === 0)
            return next(new ApiError("Image update didn't update",404));
        });
        return res
          .status(200)
          .send({ status: true, message: "Upload Images Success"});
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
}

module.exports = route;