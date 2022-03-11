const Data = require("../model")
const storage = require("../../../../uploads/images")
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
              return next(new ApiError("All Advertisement not found",404,[]));    
          return res.send({ status: 200, message: "All advertisement data success", data })
        }
        if(outdate_ads.length > 0){

          for(let i = 0; i < outdate_ads.length; i++){
            data[i].img.map(async i => {
                await storage.Delete(i._id);
            })
          }
          await Data.deleteMany({ banner_story_time:{ $lte: current_time } });
          let data = await Data.find({ 
              $and:[
                  { type: "admin_ads" },
                  { banner_story_time: { $gte: current_time } }
              ]
          });
          if(data.length === 0)
              return next(new ApiError("All Advertisement not found",404,[]));    
          return res.send({ status: 200, message: "All advertisement data success", data })
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
}

module.exports = route