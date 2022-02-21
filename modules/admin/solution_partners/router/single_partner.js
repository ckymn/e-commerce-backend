const Data = require("../model")

const route = async (req,res,next) => {
    try {
        
    } catch (error) {
        if(error){
            if(error.name === "MongoError" && error.code === 11000)
                return res.status(500).send({ status: false, message: `Add Partner File Already exists => ${error}`})
        }
        return res.status(500).send({ status: false, message: `Add Partner , Missing Something => ${error}`})
    }
};

module.exports = route