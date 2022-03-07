const Data = require("../model")
const storage = require("../../../../uploads/adminStoryAds")
const ApiError = require("../../../../errors/ApiError")

const route = async (req, res, next) => {
    try {
        let { adminData } = req;
        let current_time = new Date();
        let data = await Data.find({
          $and: [
            { type: "admin_ads"},
            { banner_story_time: { $gte: current_time } },
          ],
        }).lean();
        if(data.length === 0)
          return next(new ApiError("All advertisement not found",404));
        //let outdate_ads = await Data.find({ banner_story_time: { $lte: current_time }});
        // if(outdate_ads.length > 0){
        //     await Data.deleteMany({ banner_story_time: { $lte: current_time }});
        //     let n_data = await Data.find({});
        //     outdate_ads.map(async i => {
        //         await storage.Delete(i._id);
        //     });
        //     return res.status(200).send({ status: true, message: "All Admin Storys success and Deleted Outdate storys", data: n_data })
        // }else{
        //     return res.status(400).send({ status: true, message: "All Admin Story success and No Match Outdate sotrys", data })
        // }
        return res.status(200).send({ status: false, message: "All advertisement success",data})
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