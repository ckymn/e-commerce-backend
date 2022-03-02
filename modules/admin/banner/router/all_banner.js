const Data = require("../model")

const route = async (req, res, next) => {
    try {
        // banner time leri biten leri silme islemi ni yapmalisin
        await Data.find({}).lean().exec((err,data) =>{
            if(err) 
                return res.status(404).send({ status: false, message: `All Admin Banner Error ${err}`})
            return res.status(200).send({ status: true, message: "All Admin Banner success", data })
        })
    } catch (error) {
        if(error){
            if(error.name === "MongoError" && error.code === 11000)
                return res.status(500).send({ status: false, message: `File Already exists!  : ${error}` })
        }
        return res.status(500).send({ status: false, message: `All Admin Banner Error ,Something Missing => ${error}`})
    }
}

module.exports = route