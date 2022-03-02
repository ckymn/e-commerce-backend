const Data = require("../model")
const storage = require("../../../../uploads/adminBanners")

const route = async (req, res, next) => {
    try {
        let { body , adminData ,files } = req;

        let _data = await new Data({
            ...body,
        }).save();
        if(!_data)
            return res.status(404).send({ status: false, message: "Save Admin Banner error"})
        const imagesUrl = await storage.Upload(files,_data._id);
        let str = await Promise.all(imagesUrl).then(d => d );   
        let u_data = await Data.updateOne({_id: _data._id},{
            $push:{
                img: str
            }
        })
        if(u_data.matchedCount === 0)
            return res.status(400).send({ status: false, message: "Add Admin Banner Storage ImagUrl failed"})
        return res.status(200).send({ status: true, message: "Add Admin Banner data save and Storage ImageUrl success", data: _data })
    } catch (error) {
        if(error){
            if(error.name === "MongoError" && error.code === 11000)
                return res.status(422).send({ status: false, message: `File Already exists!  : ${error}` })
        }
        return res.status(422).send({ status: false, message: `Add Admin Banner Error , Something Missing => ${error}`})
    }
}

module.exports = route