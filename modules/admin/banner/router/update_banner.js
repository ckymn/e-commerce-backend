const Data = require("../model");
const storage = require("../../../../uploads/adminBanners")

const route = async (req, res, next) => {
    try {
        let { file , params, body } = req;
        let { id } = params;
        let data = await Data.findOne({ _id: id })
        if(!data)
            return res.status(400).send({ satus: false, message: "Not Found Update Admin Banner"})
        let d_file = await storage.Delete(req.adminData.sub,data._id)
        if(d_file != (undefined||null))
            return res.status(500).send({ status: false, message: `Delete Admin Banner file from GCS `})
        let str = await storage.upload(file,req.adminData.sub,data._id);
        if(str.status != 200)
            return res.status(str.status).send({ status: false, message: str.message})
        let u_data = await data.set({
            ...body,
            img: str.publicUrl
        })
        if(!u_data)
            return res.status(400).send({ status: false, message: "Update Admin Banner set doesn't work"})
        await u_data.save();
        return res.status(200).send({ status: true, message: "Update Admin Banner success", data})
    } catch (error) {
        if(error){
            if(error.name === "MongoError" && error.code === 11000)
                return res.status(500).send({ status: false, message: `File Already exists!  : ${error}` })
        }
        return res.status(500).send({ status: false, message: `Update Admin Banner, Something Missing => ${error}`})
    }
}

module.exports = route