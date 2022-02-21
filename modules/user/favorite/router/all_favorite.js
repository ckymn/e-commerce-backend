const Data = require("../../auth/model")

const route = async (req,res,next) => {
    try {
        let { params, body , kuserData} = req;
        await Data.findOne({ _id: kuserData.id })
            .select("favorite_product")
            .populate({ path: "favorite_product" })
            .lean().exec((err,data) => {
                if(data.length === 0)
                    return res.status(404).send({ status: false , message: "Product all Follow failed On User Data !"})
                return res.status(200).send({ status: true, message: "Product Add Favorite Success", data })
            })

    } catch (error) {
        if(error){
            if(error.name === "MongoError" && error.code === 11000)
                return res.status(500).send({ status: false, message: `File Already exists: ${error}`})
        }
        return res.status(500).send({ status: false, message: `Product Add Favorite ,Something Missing => ${error}`})
    }
}

module.exports = route