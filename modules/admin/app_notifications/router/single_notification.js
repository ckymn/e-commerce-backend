const Data = require("../model")

const route = async (req, res, next) => {
    try {
        let { body , params } = req;

        await Data.findOne({ _id: params.id }).lean().exec((err,data) => {
            if(!data)
                return res.status(404).send({ status: false, message: "Single Application Notification Failed"})
            return res.status(200).send({ status: true, message: "Single Application Notification success", data })
        });
    } catch (error) {
        if(error){
            if(error.name === "MongoError" && error.code === 11000)
                return res.status(500).send({ status: false, message: `File Already exists!  : ${error}` })
        }
        return res.status(500).send({ status: false, message: `Single Admin Banner Error , Something Missing => ${error}`})
    }
}

module.exports = route