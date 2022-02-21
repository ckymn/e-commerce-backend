const Data = require("../../auth/model")

const route = async (req,res,next) => {
    try {
        let { kuserData } = req;
        await Data.findOne({ _id: kuserData.id })
            .populate({ path: "follow", select: "username" })
            .select("follow")
            .lean().exec((err,data) => {
                if(err)
                    return res.status(404).send({ status: false, message: "No match any Data"})
                return res.status(200).send({ status: true, message: "Our Profile Page success", data })
            })
    } catch (error) {
        if(error){
            if(error.message === "MongoError" && error.code === 11000)
                return res.status(500).send({ status: false, message: `Mongo Already Exist => ${error}`})
        }
        return res.status(500).send({ status: false, message: `User Profile Mongo Error => ${error}`})
    }
};

module.exports = route;