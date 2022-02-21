const  { iyzipay, Iyzipay } = require("../../../../utils/iyzipay")
const Data = require("../model")

const route = async (req,res,next) => {
    try {
        let { userData } = req;
        await Data.find({ author: userData.id }).lean().exec((_,data) => {
            if(!data)
                return res.status(404).send({ status: false, message: "Couldn't find any data about you"})
            return res.status(200).send({ status: false, message: "All Payment Success", data })
        });
    } catch (error) {
        if(error){
            if(error.name === "MongoError" && error.code === 11000)
                return res.status(500).send({ status: false, message: `File Already exists!  : ${error}` })
        }
        return res.status(500).send({ status: false, message: `Store Orders Error Something Missing => ${error}`})
    }
};

module.exports = route;