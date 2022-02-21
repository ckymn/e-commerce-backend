const Data = require("../../../user/auth/model")

const route = async (req, res, next) => {
    try {
        let data = await Data.find({})
            .populate({ path: "follow", select: 'username' })
            .populate({ path: "favorite_product"})
            .populate({ path: "store_comment"})
            .populate({ path: "product_comment"})
            // burda populate kontrolleri yap . icindeki verilerin cikmasi lazim
            .lean().exec();
       
        if(!data)
            return res.status(404).send({ status: false, message: "Not Found Store User"})
        return res.status(200).send({status: true, message: "All Users Success", data })
    } catch (error) {
        if(error){
            if(error.name === "MongoError" && error.code === 11000)
                return res.status(500).send({ status: false, message: `File Already exists!  : ${error}` })
        }
        return res.status(500).send({ status: false, message: `All Store Users Error Cannot Upload Something Missing => ${error}`})
    }
}

module.exports = route