const Data = require("../model");
const storage = require("../../../../uploads/subscriptions")

const route = async (req, res, next) => {
    try {
        let { id } = req.params;
        let username = req.adminData.sub;
        await Data.findOneAndDelete({ _id: id }).lean().exec(async (err,data) => {
            if(err)
                return res.status(400).send({ status: false, message: `Not Found Delete Subscribe ${err}`})
            let str = await storage.Delete(username,data._id)
            if(str != (undefined || null))
                return res.status(500).send({ status: false, message: `File not deleted : ${str}`})
            return res.status(200).send({ status: true, message: "Delete Subscribe Success"})
        })
    } catch (error) {
        if(error){
            if(error.name === "MongoError" && error.code === 11000)
                return res.status(500).send({ status: false, message: `File Already exists!  : ${error}` })
        }
        return res.status(500).send({ status: false, message: `Delete Subscription, Something Missing => ${error}`})
    }
}

module.exports = route