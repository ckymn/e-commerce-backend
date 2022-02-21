const { Store_Comment } = require("../../../user/comment/model")

const route = async (req, res) => { 
    try {
        let d_w = await Store_Comment.find({"is_approved": { $in: "wait" }}).lean();
        let d_n = await Store_Comment.find({"is_approved": { $in: "no" }}).lean();
        let d_y = await Store_Comment.find({"is_approved": { $in: "yes" }}).lean();

        if(!d_w.length && !d_n.length && !d_y.length)
            return res.status(404).send({ status: false, message: "Not Found Product Comment Notification "})  
        return res.status(200).send({ status: true, message: "All Product Comment Data success return", data: { d_w, d_n, d_y }})
    } catch (error) {
        return res.status(500).send({ status: false, message: `All Product Comment Notifications Error=> ${error}`})
    }
};

module.exports = route;