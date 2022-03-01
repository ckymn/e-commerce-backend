const Data = require("../model")
const storage = require("../../../../uploads/storeStorys")

const route = async (req, res, next) => {
    try {
        let { userData, params } = req;
        await storage.Delete(params.id).catch("hata : ",console.error);
        await Data.deleteOne({ $and:[ { author: userData.id }, { _id: params.id } ] })
        return res.status(200).send({ status: true, message: "Delete Store story success" })
    } catch (error) {
        if(error){
            if(error.name === "MongoError" && error.code === 11000)
                return res.status(500).send({ status: false, message: `File Already exists: ${error}`})
        }
        return res.status(500).send({ status: false, message: `Store Add Story ,Something Missing => ${error}`})
    }
}

module.exports = route