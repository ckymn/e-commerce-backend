const Data = require("../../../store/auth/model")

const route = async (req, res, next) => {
    try {
        let _data = await Data
            .find({})
            .lean()
            .exec();
        if(!_data){
            return res.status(404).send({ status: false, message: "Not Found Store User"})
        }else{
            return res.status(200).send({status: true, message: "All Store Success", data: _data })
        }
    } catch (error) {
        if(error){
            if(error.name === "MongoError" && error.code === 11000)
                return res.status(500).send({ status: false, message: `File Already exists!  : ${error}` })
        }
        return res.status(500).send({ status: false, message: `All Store Error Cannot Upload Something Missing => ${error}`})
    }
}

module.exports = route