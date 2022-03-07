const Data = require("../model")
const storage = require("../../../../uploads/storeStorys");
const ApiError = require("../../../../errors/ApiError");

const route = async (req, res, next) => {
    try {
        let { userData } = req
        let current_time = new Date();

        let data = await Data.find({ $and:[ {author: userData.id},{story_time: { $gte: current_time }} ]})
        if(!data)
            return next(new ApiError("All story not found",404));
        // let o_data = await Data.find({ story_time: { $lte : current_time } });
        // if(!outdate_storys)
        //     return next(new ApiError(""))
        // if(outdate_storys.length > 0){
        //     await Data.deleteMany({ story_time: { $lte: current_time }});
        //     let n_data = await Data.find({ author: userData.id });
        //     outdate_storys.map(async i => {
        //         storage.Delete(i._id)
        //     })
        return res.status(200).send({ status: true, message: "All Store Storys success", data })
        
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