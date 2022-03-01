const Data = require("../model")
const storage = require("../../../../uploads/adminAds")

const route = async (req, res, next) => {
    try {
        let { files , body , adminData} = req;
        if(!files)
            return res.status(404).send({ status: true, message: "Firstly you should add image"})
        let _data = await new Data({
            ...body,
            ads_date: new Date(body.ads_date)
        }).save();
        if(!_data)
            return res.status(400).send({ status: false, message: "Admin Add Advertisement doesn't work"})
        const imagesUrl = await storage.Upload(files,_data._id);
        let str = await Promise.all(imagesUrl).then(d => d );
        await Data.updateOne({_id: _data._id},{
            $push: {
                img: str,
            }
        })
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