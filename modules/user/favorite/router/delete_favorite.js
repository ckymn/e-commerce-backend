const Data = require("../../auth/model")

const route = async (req,res,next) => {
    try {
        let { params, body , kuserData} = req;
        await Data.updateOne({ _id: kuserData.id }, {
            $pull: { 
                favorite_product: {
                    $in:  params.id 
                }
            }
        }).exec((err,data) => {
            if(data.matchedCount === 0)
                return res.status(404).send({ status: false , message: "Product Not Found failed !"})
            return res.status(200).send({ status: true, message: "Product Delete Favorite Success "})
        })

    } catch (error) {
        if(error){
            if(error.name === "MongoError" && error.code === 11000)
                return res.status(500).send({ status: false, message: `File Already exists: ${error}`})
        }
        return res.status(500).send({ status: false, message: `Product Delete Favorite ,Something Missing => ${error}`})
    }
}

module.exports = route