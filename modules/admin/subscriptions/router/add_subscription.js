const Data = require("../model");
const storage = require("../../../../uploads/subscriptions")

const route = async (req, res, next) => {
    try {
        let { body, file, adminData } = req;
        let data = await new Data({
            ...body 
        })
        if(!data)
            return res.status(400).send({ status: false, message: `Not Found Subscribe Data`})
        const str = await storage.upload(file, adminData.sub,data._id)
        if(str.status != 200)
            return res.status(str.status).send({ status: false, message: str.message})
        await data.set({ 
            img: str.publicUrl
        })
        await data.save();
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