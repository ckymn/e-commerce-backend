const Data = require('../../../store/advertisement/model')

const route = async (req, res) => { 
    try {
        let d_w = await Data.find({"is_approved": { $in: "wait" }}).lean();
        let d_n = await Data.find({"is_approved": { $in: "no" }}).lean();
        let d_y = await Data.find({"is_approved": { $in: "yes" }}).lean();

        if(!d_w.length && !d_n.length && !d_y.length)
            return res.status(404).send({ status: false, message: "Not Found Advertisement Notification "})  
        return res.status(200).send({ status: true, message: "All Advertisement Data success return", data: { d_w, d_n, d_y }})
    } catch (error) {
        return res.status(500).send({ status: false, message: `All Advertisement Notifications => ${error}`})
    }
};

module.exports = route;