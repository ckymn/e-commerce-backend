const Data = require("../model")
const storage = require("../../../../uploads/adminStoryAds")
const route = async (req, res, next) => {
    try {
        let current_time = new Date();
        let data = await Data.find({}).lean();
        
        let outdate_ads = await Data.find({ banner_story_time: { $lte: current_time }});
        if(outdate_ads.length > 0){
            await Data.deleteMany({ banner_story_time: { $lte: current_time }});
            let n_data = await Data.find({});
            outdate_ads.map(async i => {
                await storage.Delete(i._id);
            });
            return res.status(200).send({ status: true, message: "All Admin Storys success and Deleted Outdate storys", data: n_data })
        }else{
            return res.status(400).send({ status: true, message: "All Admin Story success and No Match Outdate sotrys", data })
        }
    } catch (error) {
      if (error.name === "MongoError" && error.code === 11000) {
        return res
          .status(422)
          .send({ status: false, message: `File Already exists: ${error}` });
      } else {
        return res
          .status(500)
          .send({
            status: false,
            message: `Admin All Advertisement ,Something Missing => ${error}`,
          });
      }
    }
}

module.exports = route