const Data = require("../model")
const storage = require("../../../../uploads/adminBanners")

const route = async (req, res, next) => {
    try {
        let { body , adminData , params } = req;

        await Data.findOneAndDelete({ _id: params.id }).lean().exec(async(err,data) => {
            if(!data)
                return res.status(404).send({ status: false, message: "Delete Admin Banner Don't Found"})
            await storage.Delete(data._id)
            return res.status(200).send({ status: true, message: "Delete Admin Banner Success"})
        });
    } catch (error) {
        if(error){
            if(error.name === "MongoError" && error.code === 11000)
                return res.status(422).send({ status: false, message: `File Already exists!  : ${error}` })
        }
        return res.status(422).send({ status: false, message: `Delete Admin Banner Error , Something Missing => ${error}`})
    }
}

module.exports = route