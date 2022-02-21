const Data = require("../../../store/payment/model")

const route = async (req, res, next) => {
    try {
        // who can see there ?
        await Data.find({})
            .populate({ path: 'author', select: 'sector_name -_id', options: { lean: true}})
            .lean().exec((err,data) => {
                if(err)
                    return res.status(404).send({ status: false, message: "Not Found Payment Info "})
                return res.status(200).send({ status: true, message: "All Payment Info Success", data })
        })
    } catch (error) {
        if(error){
            if(error.message === "MongoError" && error.code === 11000)
                return res.status(500).send({ status: false, message: `Mongo Error, Already Exist : ${error}`})
        }
        return res.status(500).send({ status: false, message: `All Payment Error, Missing Something ${error}`})
    }
}

module.exports = route