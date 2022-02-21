const Data = require("../model")

const route = async (req,res,next) => {
    try {
        let { userData, params } = req;
        let _data = await Data.findOne({ $and: [ { author: userData.id }, { _id: params.id } ] }).lean();
        if(!_data)
            return res.status(404).send({ status: false, message: "You don't have any Oder"})
        return res.status(200).send({ status: true, message: "The Single Order were finded", data: _data })
        
    } catch (error) {
        if(error){
            if(error.name === "MongoError" && error.code === 11000)
                return res.status(500).send({ status: false, message: `File Already exists!  : ${error}` })
        }
        return res.status(500).send({ status: false, message: `Store Orders Error Something Missing => ${error}`})
    }
};

module.exports = route;