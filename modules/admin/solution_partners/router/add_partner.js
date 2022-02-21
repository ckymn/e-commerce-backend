const Data = require("../model")

const route = async (req,res,next) => {
    try {
        let { body } = req;
        let _data = await new Data({
            ...body
        })
        if(!_data) 
            return res.status(400).send({ status: false, message: "Create Solution Partener Data Failed !"})
        await _data.save();
        return res.status(200).send({ status: true, message: "Solution Partner Data Success ", data: _data })
    } catch (error) {
        if(error){
            if(error.name === "MongoError" && error.code === 11000)
                return res.status(500).send({ status: false, message: `Add Partner File Already exists => ${error}`})
        }
        return res.status(500).send({ status: false, message: `Add Partner , Missing Something => ${error}`})
    }
};

module.exports = route