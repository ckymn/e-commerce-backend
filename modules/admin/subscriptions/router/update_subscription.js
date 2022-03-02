const Data = require("../model");
const storage = require("../../../../uploads/subscriptions")

const route = async (req, res, next) => {
    try {
        let { files , params, body } = req;

        let data = await Data.findOne({ _id: params.id })
        if(!data)
            return res.status(400).send({ satus: false, message: "Not Found Update Subscribe"})
        await storage.Delete(data._id)
        let str = await storage.Upload(files,data._id);
        console.log("update subscribe",str)
        let u_data =  await Data.updateOne({_id: data._id},{
            $push: {
                img: str,
            },
        })
        if(!u_data)
            return res.status(400).send({ status: false, message: "Update Data set doesn't work"})
        await u_data.save();
        return res.status(200).send({ status: true, message: "Update Subscribe success", data})
    } catch (error) {
        if(error){
            if(error.name === "MongoError" && error.code === 11000)
                return res.status(500).send({ status: false, message: `File Already exists!  : ${error}` })
        }
        return res.status(500).send({ status: false, message: `Update Subscription, Something Missing => ${error}`})
    }
}

module.exports = route