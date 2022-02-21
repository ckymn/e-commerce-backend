const { Product_Star } = require("../model")
const Product = require("../../../store/products/model")

const route = async( req,res,next) => {
    try {
        let { body ,kuserData , params} = req;
        await Product_Star.updateOne({ $and:[{ product_id: params.id }, { author: kuserData.id }] }, {
            $set: {
                rate: body.rate
            }
        }, { new: true }).lean().exec(async(err,data) => {
            if(data.matchedCount === 0)
                return res.status(400).send({ status: false, message: "Not Found Star Document"})
            return res.status(200).send({ status: true, message: "User Update Product Comment Success"})
        })
        
    } catch (error) {
        if(error){
            if(error.name === "MongoError" && error.code === 11000)
                return res.status(500).send({ status: false, message: `Mongo Error ${error}`})
        }
        return res.status(500).send({ status: false, message: `User Comment Delete of Product, Something Missing Error : ${error}`})
    }
}

module.exports = route