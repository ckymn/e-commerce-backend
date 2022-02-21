const Data = require("../model")
const Store = require("../../auth/model");
const storage = require("../../../../uploads/storeStorys");

const route = async (req, res, next) => {
    try {
        let { body, file , userData } = req;
        let author_img = await Store.findOne({ _id: userData.id });
        let _data = await new Data({
            ...body,
            author: userData.id,
            author_img: author_img.storeimg,
        })
        if(!_data)
            return res.status(400).send({ status: false, message: "Not Found Add Store Story!"})
        if(file.mimetype.substr(0,5) === "video"){
            const str = await storage.vUpload(file, userData.sub, _data._id);
            if(str.status != 200)
                return res.status(str.status).send({ status: false, message: str.message})
            let u_data = await _data.set({
                img: str.publicUrl
            })
            await u_data.save()
            return res.status(200).send({ status: true, message: "Add Store story worked", data: _data })
        }
        if(file.mimetype.substr(0,5) === "image"){
            const str = await storage.upload(file, userData.sub, _data._id);
            if(str.status != 200)
                return res.status(str.status).send({ status: false, message: str.message})
            let u_data = await _data.set({
                img: str.publicUrl
            })
            await u_data.save()
            return res.status(200).send({ status: true, message: "Add Store story worked", data: _data })
        }
        
    } catch (error) {
        if(error){
            if(error.name === "MongoError" && error.code === 11000)
                return res.status(500).send({ status: false, message: `File Already exists: ${error}`})
        }
        return res.status(500).send({ status: false, message: `Store Add Story ,Something Missing => ${error}`})
    }
}

module.exports = route