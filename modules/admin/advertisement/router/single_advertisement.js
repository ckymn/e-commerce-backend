const Data = require("../model")

const route = async (req, res, next) => {
    try {
        let { id } = req.params
        let _data = await Data.findOne({ _id : id })
        if(!_data)
            return res.status(400).send({ status: false, message: "Admin Single Advertisement doesn't work"})
        return res.status(200).send({ status: true, message: "Admin Single Advertisement success", data: _data })
    } catch (error) {
        if(error){
            if(error.name === "MongoError" && error.code === 11000)
                return res.status(500).send({ status: false, message: `File Already exists: ${error}`})
        }
        return res.status(500).send({ status: false, message: `Admin Single Advertisement,Something Missing => ${error}`})
    }
}

module.exports = route