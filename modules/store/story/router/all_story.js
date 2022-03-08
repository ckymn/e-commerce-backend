const Data = require("../model")
const storage = require("../../../../uploads/storeStorys");
const ApiError = require("../../../../errors/ApiError");

const route = async (req, res, next) => {
    try {
        let { userData } = req
        let current_time = new Date();

        let outdate_stories = await Data.find({ story_time: { $lte: current_time }})
        if(outdate_stories.length === 0){
          let data = await Data.find({
            $and: [
              { author: userData.id },
              { story_time: { $gte: current_time } },
            ],
          });
          if(data.length === 0)
            return next(new ApiError("All story not found",200,data))
          return res.status(200).send({ status: true, message: "All advertisement data success", data })
        }
        if (outdate_stories.length > 0) {
            await Data.deleteMany({ story_time: { $lte: current_time } });
            let outdate_stories_id = outdate_stories.map(i => i._id);
            await storage.Delete(outdate_stories_id);
            let data = await Data.find({
              $and: [
                { author: userData.id },
                { story_time: { $gte: current_time } },
              ],
            });
            if(data.length === 0)
              return next(new ApiError("All story not found",200,data))
            return res.status(200).send({ status: true, message: "All advertisement data success", data })
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

module.exports = route