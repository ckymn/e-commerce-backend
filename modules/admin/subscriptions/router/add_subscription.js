const Data = require("../model");
const storage = require("../../../../uploads/subscriptions")

const route = async (req, res, next) => {
    try {
        let { body, files, adminData } = req;
        let data = await new Data({
            ...body 
        }).save()
        if(!data)
            return res.status(400).send({ status: false, message: `Not Found Subscribe Data`})
        const imagesUrl = await storage.Upload(files,data._id);
        let str = await Promise.all(imagesUrl).then(d => d );
        await Data.updateOne({_id: data._id},{
            $push: {
                img: str,
            },
        })
        return res.status(200).send({ status: true, message: "Subscribe Data success", data })
    } catch (error) {
        if(error){
            if(error.name === "MongoError" && error.code === 11000)
                return res.status(500).send({ status: false, message: `File Already exists!  : ${error}` })
        }
        return res.status(500).send({ status: false, message: `Add Subscription, Something Missing => ${error}`})
    }
}

module.exports = route