const { Product_Comment } = require("../model")
const Product = require("../../../store/products/model")

const route = async( req,res,next) => {
    try {
        let { body ,kuserData , params} = req;
        await Product_Comment.findOneAndRemove({ $and: [ { author: kuserData.id },{ _id: params.id } ] }).lean().exec(async (err,data) => {
            if(err) 
                return res.status(400).send({ status: false, message: "Delete Product Comment failed" })
            await Product.updateOne({ _id: data.product_id }, 
                { 
                    $pull: { 
                        comments: { 
                            $in : data._id 
                        }
                    }
                }).lean().exec((_err, _data) => {
                if(_err)
                    return res.status(400).send({ status: false, message: "Delete Product Comment Success but Update Products Comment Failed"})
                return res.status(200).send({ status: true, message: "Delete Product Comment and Update Products Comment Success" })
            });
        })
    } catch (error) {
        console.log(error);
        if(error){
            if(error.name === "MongoError" && error.code === 11000)
                return res.status(500).send({ status: false, message: `Mongo Error ${error}`})
        }
        return res.status(500).send({ status: false, message: `User Comment Add of Product, Something Missing Error : ${error}`})
    }
}

module.exports = route