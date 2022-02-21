const Data = require("../model")
const storage = require("../../../../uploads/products")

const route = async(req,res,next) => {
    try {
        let { body ,files ,params, userData } = req;
        let _data = await Data.findOne({ $and:[ { author: userData.id }, { _id: params.id } ] })
        if(!_data)
            return res.status(404).send({ status: false, message:"Not Found Update Data"})
        const d_files = await storage.Delete(userData.sub,params.id);
        if(d_files != (undefined||null))
            return res.status(500).send({ status: false, message: `Delete products file from GCS : ${files}`})
        const imageUrl = await storage.Upload(files, userData.sub, _data._id);
        let str = await Promise.all(imageUrl).then(d => d );
        let u_data = await _data.set({
            ...body,
            images: str.map(i => i)
        })
        if(!u_data)
            return res.status(400).send({ status: false, message: "Update Data set doesn't work"})
        await u_data.save();
        return res.status(200).send({ status: true, message: "Update Data Product Success", data: u_data})
    } catch (error) {
        console.log(error);
        if(error){
            if(error.name === "MongoError" && error.code === 11000)
                return res.status(500).send({ status: false, message: `File Already exists!  : ${error}` })
        }
        return res.status(500).send({ status: false, message: `Update Products Error Cannot Upload Something Missing => ${error}`})
    }
}

module.exports = route