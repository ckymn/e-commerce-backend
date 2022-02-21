const Data = require("../model")
const storage = require("../../../../uploads/adminBanners")

const route = async (req, res, next) => {
    try {
        let { body , adminData ,file , params } = req;

        await Data.findOneAndDelete({ _id: params.id }).lean().exec(async(err,data) => {
            if(err)
                return res.status(404).send({ status: false, message: "Delete Admin Banner error"})
            let str = await storage.Delete(adminData.sub,data._id)
            if(str != (undefined || null))
                return res.status(500).send({ status: false, message: `File not deleted : ${str}`})
            return res.status(200).send({ status: true, message: "Delete Admin Banner Success"})
        });
    } catch (error) {
        if(error){
            if(error.name === "MongoError" && error.code === 11000)
                return res.status(500).send({ status: false, message: `File Already exists!  : ${error}` })
        }
        return res.status(500).send({ status: false, message: `Delete Admin Banner Error , Something Missing => ${error}`})
    }
}

module.exports = route