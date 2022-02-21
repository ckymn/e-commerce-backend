const Data = require("../../auth/model")


const route = async (req, res, next) => {
    try {
        let { id } = req.params;
        let _data = await Data.findOne({ _id: id }).select('-_id name surname username storename').lean().exec();
        if(!_data)
            return res.status(404).send({ status: false, message: "Not Found Show about Seller"})
        return res.status(200).send({ status: true, message: "Seller Show Information success", data: _data })
    } catch (error) {
        if(error){
            if(error.name === "MongoError" && error.code === 11000)
                return res.status(500).send({ status: false, message: `File Already exists!: ${error} `})
        }
        return res.status(500).send({ status: false, message: `Show Information Seller Cannot Upload , Something Missing => ${error}`})
    }
}

module.exports = route