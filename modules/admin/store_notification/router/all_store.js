const Data = require("../../../store/auth/model");

const route = async (req,res,next) => {
    try {
        let d_w = await Data.find({"is_approved": { $in: "wait" }}).lean();
        let d_n = await Data.find({"is_approved": { $in: "no" }}).lean();
        let d_y = await Data.find({"is_approved": { $in: "yes" }}).lean();

        if(!d_w.length && !d_n.length && !d_y.length)
            return res.status(404).send({ status: false, message: "Not Found Store Notification "})  
        return res.status(200).send({ status: true, message: "All Store Data success return", data: { d_w, d_n, d_y }})
    } catch (error) {
        if(error){
            if(error.message === "MongoError" && error.code === 11000)
                return res.status(500).send({ status: false, message: `Mongo Connect Error => ${error}`})
        }
        return res.status(500).send({ status: false, message: `All Store Notifications => ${error}`})
    }
};

module.exports = route;