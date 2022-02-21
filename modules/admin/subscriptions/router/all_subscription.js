const Data = require("../model");

const route = async (req, res, next) => {
    try {
        await Data.find({}).lean().exec((err,data) =>{
            if(err)
                return res.status(400).send({ status: false, message: `Not Found All Subscribe Data : ${err}`})
            return res.status(200).send({ status: true , message: "All Subscribe Success ", data })
        })
    } catch (error) {
        if(error){
            if(error.name === "MongoError" && error.code === 11000)
                return res.status(500).send({ status: false, message: `File Already exists!  : ${error}` })
        }
        return res.status(500).send({ status: false, message: `All Subscription, Something Missing => ${error}`})
    }
}

module.exports = route