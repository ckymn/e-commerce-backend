const Data = require("../model")

const route = async (req,res,next) => {
    try {
        let { params } = req;
        await Data.findOneAndDelete({ _id: params.id }).lean().exec((err,data) => {
            if(err)
                return res.status(400).send({ status: false, message: "Delete Solution Partner failed"})
            if(!data)
                return res.status(404).send({ status: false, message: "Not Found Delete Solution Partner"})
            return res.status(200).send({ status: true, message: "Delete Solution Partner success " }) 
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