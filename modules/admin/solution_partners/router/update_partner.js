const Data = require("../model")

const route = async (req,res,next) => {
    try {
        let { params , body } = req;
        await Data.findOneAndUpdate({ _id: params.id}, { $set: {...body} }, { new: true }).lean().exec((err,data) => {
            if(err)
                return res.status(400).send({ status: false, message: "Update Solution Partner failed"})
            if(!data)
                return res.status(404).send({ status: false, message: "Not Found Update Solution Partner"})
            return res.status(200).send({ status: true, message: "Update Solution Partner success " , data}) 
        })
    } catch (error) {
        if(error){
            if(error.name === "MongoError" && error.code === 11000)
                return res.status(500).send({ status: false, message: `Add Partner File Already exists => ${error}`})
        }
        return res.status(500).send({ status: false, message: `Add Partner , Missing Something => ${error}`})
    }
};

module.exports = route