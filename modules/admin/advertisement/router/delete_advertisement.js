const Data = require("../model")
const storage = require("../../../../uploads/adminAds")

const route = async (req, res, next) => {
    try {
        let { params } = req
        await storage.Delete(params.id).catch("hata : ",console.error);
        await Data.deleteOne({ _id: params.id  })
        return res.status(200).send({ status: true, message: "Delete Advertisement story success" })

    } catch (error) {
        if(error){
            if(error.name === "MongoError" && error.code === 11000)
                return res.status(500).send({ status: false, message: `File Already exists: ${error}`})
        }
        return res.status(500).send({ status: false, message: `Admin Delete Advertisement ,Something Missing => ${error}`})
    }
}

module.exports = route