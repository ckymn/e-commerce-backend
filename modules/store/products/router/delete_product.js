const Data = require("../model")
const storage = require("../../../../uploads/products")

const route = async (req, res, next) => {
    try {
        let { id } = req.params;
        let u_id = req.userData.id;
        let u_name = req.userData.sub;

        let files = await storage.Delete(u_name, id);
        if(files != (undefined||null))
            return res.status(500).send({ status: false, message: `Delete products file from GCS : ${files}`})
        let s_d = await Data.deleteOne({ $and: [ {author: u_id}, { _id: id } ] }).lean();
        if(s_d.deletedCount === 0)
            return res.status(404).send({ status: false, message: "Single product delete error"})
        return res.status(200).send({ status: true, message: "Single product delete success" })
    } catch (error) {
        if(error){
            if(error.name === "MongoError" && error.code === 11000)
                return res.status(500).send({ status: false, message: `File Already exists!  : ${error}` })
        }
        return res.status(500).send({ status: false, message: `Delete Product Error Cannot Upload Something Missing => ${error}`})
    }
}

module.exports = route