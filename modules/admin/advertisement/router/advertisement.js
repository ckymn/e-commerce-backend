const Data = require("../model")
const storeage = require("../../../../uploads/adminAds")

const route = async (req, res, next) => {
    try {
        let { file , body , adminData} = req;
       
        if(!file)
            return res.status(404).send({ status: true, message: "Firstly you should add image"})
        let _data = await new Data({
            ...body
        });
        if(!_data)
            return res.status(400).send({ status: false, message: "Admin Add Advertisement doesn't work"})
        const imageUrl = await storeage.Upload(file, adminData.id, _data._id)
        await _data.set({
            img: imageUrl
        })
        await _data.save();
        return res.status(200).send({ status: true, message: "Admin Add Advertisement success", data: _data })
    } catch (error) {
        if(error){
            if(error.name === "MongoError" && error.code === 11000)
                return res.status(500).send({ status: false, message: `File Already exists: ${error}`})
        }
        return res.status(500).send({ status: false, message: `Admin Add Advertisement ,Something Missing => ${error}`})
    }
}

module.exports = route