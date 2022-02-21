const Data = require("../model")
const storage = require("../../../../uploads/storeStorys")

const route = async (req, res, next) => {
    try {
        let { userData, params } = req;

        let _data = await Data.deleteOne({ $and:[ { author: userData.id }, { _id: params.id } ] })
        if(_data.deletedCount === 0)
            return res.status(400).send({ status: false, message: "Delete store story did not Found" })
        const str = await storage.SingleDelete(userData.sub, params.id)
        //if(str.status != 200)
        //    return res.status(str.status).send({ status: false, message: str.message })
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