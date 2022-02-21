const Data = require("../model")
const storage = require("../../../../uploads/storeAds")

const route = async (req,res,next) => {
    try {
        let { userData } = req;
        let current_time = new Date();

        let d_w = await Data.find({ $and: [ { author: userData.id }, {"is_approved" : { $in: "wait"}} ] }).lean();
        let d_n = await Data.find({ $and: [ { author: userData.id }, {"is_approved" : { $in: "no"}} ] }).lean();
        let d_y = await Data.find({ $and: [ { author: userData.id }, {"is_approved" : { $in: "yes"}} ] }).lean();

        let outdate_ads = await Data.find({ $and:[{"is_approved":{$in:"yes"}},{banner_story_time:{ $lte: current_time }}] })
        if(outdate_ads.length > 0){
            await Data.deleteMany({ banner_story_time: { $lte: current_time }});
            let n_d_w = await Data.find({"is_approved": { $in: "wait" }}).lean();
            let n_d_n = await Data.find({"is_approved": { $in: "no" }}).lean();
            let n_d_y = await Data.find({"is_approved": { $in: "yes" }}).lean();
            let outdate_ads_id = outdate_ads.map(i => i._id);
            const str = await storage.MultipleDelete(userData.id,outdate_ads_id);
            // burda zamani gecmis Ads'nin GCs silinmesi lazim
            if(str.status !=200)
                return res.status(str.status).send({ status: false,message:str.message})
            if(!n_d_w.length && !n_d_n.length && !n_d_y.length)
                return res.status(404).send({ status: false, message: "Not Found Advertisement Notification "})  
            return res.status(200).send({ status: true, message: "All Advertisement Data success return", data: { n_d_w, n_d_n, n_d_y }})
        }else{
            if(!d_w.length && !d_n.length && !d_y.length)
                return res.status(404).send({ status: false, message: "Not Found Advertisement Notification "})  
            return res.status(200).send({ status: true, message: "All Advertisement Data success return", data: { d_w, d_n, d_y }})
        }
    } catch (error) {
        return res.status(500).send({ status: false, message: `All Advertisement => ${error}`})
    }
}

module.exports = route; 