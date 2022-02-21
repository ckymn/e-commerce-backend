const Data = require("../model")
const storage = require("../../../../uploads/storeAds")

const route = async (req, res, next) => {
    try {
        let { id } = req.params;
        let k_id = req.userData.id;

        let files = await storage.Delete(k_id, id);
        if(files != undefined)
            return res.status(500).send({ status: false, message: `Delete store advertisement file from GCS : ${files}`})
        let s_d = await Data.deleteOne({ $and: [ { author: k_id }, { _id: id } ] }).lean();
        if(!s_d)
            return res.status(404).send({ status: false, message: "Single product delete error"})
        return res.status(200).send({ status: true, message: "Single product delete success" })
    } catch (error) {
        if(error){
            if(error.name === "MongoError" && error.code === 11000)
                return res.status(500).send({ status: false, message: `File Already exists!  : ${error}` })
        }
        return res.status(500).send({ status: false, message: `All Products Error Cannot Upload Something Missing => ${error}`})
    }
}

module.exports = route  