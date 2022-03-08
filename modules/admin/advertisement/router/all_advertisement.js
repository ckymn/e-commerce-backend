const Data = require("../model")
const storage = require("../../../../uploads/adminStoryAds")
const ApiError = require("../../../../errors/ApiError")

const route = async (req, res, next) => {
    try {
        let { adminData } = req;
        let current_time = new Date();

        let outdate_ads = await Data.find({banner_story_time:{ $lte: current_time } })
        if(outdate_ads.length === 0){
          let data = await Data.find({ 
              $and:[
                  { type: "admin_ads" },
                  { banner_story_time: { $gte: current_time } }
              ]
          });
          if(data.length === 0)
              return next(new ApiError("All Advertisement not found",200,data));    
          return res.status(200).send({ status: true, message: "All advertisement data success", data })
        }
        if(outdate_ads.length > 0){
          await Data.deleteMany({ banner_story_time: { $lte: current_time }});
          let outdate_ads_id = outdate_ads.map(i => i._id);
          await storage.Delete(outdate_ads_id);
          let data = await Data.find({ 
              $and:[
                  { type: "admin_ads" },
                  { banner_story_time: { $gte: current_time } }
              ]
          });
          if(data.length === 0)
              return next(new ApiError("All Advertisement not found",200,data));    
          return res.status(200).send({ status: true, message: "All advertisement data success", data })
        }
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