const Data = require("../model")
const storage = require("../../../../uploads/storeAds");
const ApiError = require("../../../../errors/ApiError");

const route = async (req,res,next) => {
    try {
        let { userData } = req;
        let current_time = new Date();

        let data = await Data.find({ 
            $and:[
                { _id: userData.id },
                { is_approved: "yes" },
                { banner_story_time: { $gte: current_time } }
            ]
        });
        if(data.length === 0)
            return next(new ApiError("All Advertisement not found",404));
       // ! BURDA STORY'LERI KALDIRMAK..
        // let outdate_ads = await Data.find({ $and:[{"is_approved":{$in:"yes"}},{banner_story_time:{ $lte: current_time }}] })
        // if(!outdate_ads)
        //     return next(new ApiError("Outdate Advertisement not found",404))
        
        // let d_w = await Data.find({ $and: [ { author: userData.id }, {"is_approved" : { $in: "wait"}} ] }).lean();
        // let d_n = await Data.find({ $and: [ { author: userData.id }, {"is_approved" : { $in: "no"}} ] }).lean();
        // let d_y = await Data.find({ $and: [ { author: userData.id }, {"is_approved" : { $in: "yes"}} ] }).lean();
        
        // if(outdate_ads.length > 0){
        //     await Data.deleteMany({ banner_story_time: { $lte: current_time }});
        //     let n_d_w = await Data.find({"is_approved": { $in: "wait" }}).lean();
        //     let n_d_n = await Data.find({"is_approved": { $in: "no" }}).lean();
        //     let n_d_y = await Data.find({"is_approved": { $in: "yes" }}).lean();
        //     let outdate_ads_id = outdate_ads.map(i => i._id);
        //     const str = await storage.Delete(userData.id,outdate_ads_id);
            
        //     if(str.status !=200)
        //         return res.status(str.status).send({ status: false,message:str.message})
        //     if(!n_d_w.length && !n_d_n.length && !n_d_y.length)
        //         return res.status(404).send({ status: false, message: "Not Found Advertisement Notification "})  
        //     return res.status(200).send({ status: true, message: "All Advertisement Data success return", data: { n_d_w, n_d_n, n_d_y }})
        // }else{
        //     if(!d_w.length && !d_n.length && !d_y.length)
        //         return res.status(404).send({ status: false, message: "Not Found Advertisement Notification "})  
        //     return res.status(200).send({ status: true, message: "All Advertisement Data success return", data: { d_w, d_n, d_y }})
        // }
        return res.status(200).send({ status: true, message: "All advertisement data success", data })

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