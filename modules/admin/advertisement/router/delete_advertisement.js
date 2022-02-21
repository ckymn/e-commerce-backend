const Data = require("../model")
const storage = require("../../../../uploads/adminAds")

const route = async (req, res, next) => {
    try {
        let { id } = req.params
        let a_id = req.adminData.id;

        let files = await storage.Delete(a_id, id);
        if(files != undefined)
            return res.status(500).send({ status: false, message: `Delete admin advertisement file from GCS : ${files}`})

        let _data = await Data.deleteOne({ _id : id })
        if(_data.deletedCount === 0)
            return res.status(400).send({ status: false, message: "Admin Delete Advertisementdoesn't work"})
        return res.status(200).send({ status: true, message: "Admin Delete Advertisement success", data: _data })
    } catch (error) {
        if(error){
            if(error.name === "MongoError" && error.code === 11000)
                return res.status(500).send({ status: false, message: `File Already exists: ${error}`})
        }
        return res.status(500).send({ status: false, message: `Admin Delete Advertisement ,Something Missing => ${error}`})
    }
}

module.exports = route