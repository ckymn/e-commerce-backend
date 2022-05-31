const Data = require("../model");
const storage = require("../../../../scripts/images");
const ApiError = require("../../../../errors/ApiError");

const route = async (req, res, next) => {
  try {
    let { userData } = req;
    let current_time = new Date();

    let outdate_stories = await Data.find({
      story_time: { $lte: current_time },
    });

    if (outdate_stories.length === 0) {
      let data = await Data.find({
        $and: [{ author: userData.id }, { story_time: { $gte: current_time } }],
      });
      if (data.length === 0)
        return next(new ApiError("All story not found", 400, data));
      return res.send({
        status: 200,
        message: "All advertisement data success",
        data,
      });
    }
    if (outdate_stories.length > 0) {
      for (let i = 0; i < outdate_stories.length; i++) {
        let outdate_stories = await Data.find({
          story_time: { $lte: current_time },
        });
        outdate_stories[i].img.map(async (i) => {
          await storage.Delete(i._id);
        });
      }
      await Data.deleteMany({
        $and: [{ author: userData.id }, { story_time: { $lte: current_time } }],
      });
      // find stories
      let data = await Data.find({
        $and: [{ author: userData.id }, { story_time: { $gte: current_time } }],
      });

      if (data.length === 0)
        return next(new ApiError("All story not found", 404, data));
      return res.send({
        status: 200,
        message: "All advertisement data success",
        data,
      });
    }
  } catch (error) {
    if (error.name === "MongoError" && error.code === 11000) {
      next(new ApiError(error?.message, 422));
    }
    if (error.code === 27) {
      next(new ApiError("We Don't Have Any Data", 204, []));
    }
    next(new ApiError(error?.message));
  }
};

module.exports = route;
