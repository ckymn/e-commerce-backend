const Data = require("../model")
const storage = require("../../../../uploads/adminBanners")

const route = async (req, res, next) => {
    try {
        let { body , adminData ,file } = req;

        let _data = await new Data({
            ...body,
        });
        if(!_data)
            return res.status(404).send({ status: false, message: "Save Admin Banner error"})
        const str = await storage.upload(file,adminData.sub,_data._id);
        if(str.status != 200)
            return res.status(str.status).send({ status: false, message: str.message})
        let u_data = await _data.set({
            img: str.publicUrl
        })
        if(!u_data)
            return res.status(400).send({ status: false, message: "Add Admin Banner Storage ImagUrl failed"})
        await _data.save();
        return res.status(200).send({ status: true, message: "Add Admin Banner data save and Storage ImageUrl success", data: u_data })
    } catch (error) {
        if(error){
            if(error.name === "MongoError" && error.code === 11000)
                return res.status(500).send({ status: false, message: `File Already exists!  : ${error}` })
        }
        return res.status(500).send({ status: false, message: `Add Admin Banner Error , Something Missing => ${error}`})
    }
}

module.exports = route