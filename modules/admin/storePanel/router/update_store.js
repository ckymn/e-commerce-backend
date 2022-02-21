const Data = require("../../../store/auth/model")

const route = async (req, res, next) => {
    try {
        let { id } = req.params;
        let { extra_remain_date } = req.body;

        let _data = await Data.updateOne({ _id: id },
            {
                $inc: {
                    remain_date: extra_remain_date
                }
            }).lean().exec();
        if(_data.matchedCount === 0)
            return res.status(404).send({ status: false, message: "Not Found Any Store Data"})
        return res.status(200).send({status: true, message: "Update Store Remain Date Success"})
    } catch (error) {
        console.log(error);
        if(error){
            if(error.name === "MongoError" && error.code === 11000)
                return res.status(500).send({ status: false, message: `File Already exists!  : ${error}` })
        }
        return res.status(500).send({ status: false, message: `Update Store Remain Date, Something Missing => ${error}`})
    }
}

module.exports = route