const Data = require("../../../store/auth/model")

const route = async (req, res, next) => {
    try {
        let { id } = req.params;

        let _data = await Data.findOne({ _id: id })
            .populate({ path: "comment" })
            .populate({ path: "follow" , select: "username" })
            .lean().exec();
        if(!_data)
            return res.status(404).send({ status: false, message: "Not Found Any Store User"})
        return res.status(200).send({status: true, message: "Single Users Success", data: _data })
    } catch (error) {
        console.log(error);
        if(error){
            if(error.name === "MongoError" && error.code === 11000)
                return res.status(500).send({ status: false, message: `File Already exists!  : ${error}` })
        }
        return res.status(500).send({ status: false, message: `All Store Users Error Cannot Upload Something Missing => ${error}`})
    }
}

module.exports = route