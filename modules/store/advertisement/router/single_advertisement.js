const Data = require("../model")

const route = async (req, res, next) => {
    try {
        let { id } = req.params;
        let k_id = req.userData.id;
        let s_d = await Data.findOne({ $and: [ { author: k_id }, { _id: id } ] }).lean();
        if(!s_d)
            return res.status(404).send({ status: false, message: "Single Advertisement find error"})
        return res.status(200).send({ status: true, message: "Single Advertisement search success", data: s_d })
    } catch (error) {
        if(error){
            if(error.name === "MongoError" && error.code === 11000)
                return res.status(500).send({ status: false, message: `File Already exists!  : ${error}` })
        }
        return res.status(500).send({ status: false, message: `Single Advertisement Error Cannot Upload Something Missing => ${error}`})
    }
}

module.exports = route