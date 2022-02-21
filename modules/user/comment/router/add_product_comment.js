const { Product_Comment } = require("../model")
const Product = require("../../../store/products/model")

const route = async( req,res,next) => {
    try {
        let { body ,kuserData , params} = req;
        let _data = await new Product_Comment({
            ...body,
            product_id: params.id,
            author: kuserData.id,
        })
        if(!_data)
            return res.status(400).send({ status: false, message: "Add Product Comment Data Error"})
        let p_data = await Product.findOneAndUpdate({ _id: params.id }, 
            {
                $push: {
                    "comments": _data._id
                }
            }, { new: true })
        if(!p_data)
            return res.status(400).send({ status: false, message: "Add Product Comment Data success but Update Product Comment error"})
        await _data.save();
        return res.status(200).send({ status: true, message: "User to Product Comment Success", data: _data })
    } catch (error) {
        if(error){
            if(error.name === "MongoError" && error.code === 11000)
                return res.status(500).send({ status: false, message: `Mongo Error ${error}`})
        }
        return res.status(500).send({ status: false, message: `User Comment Add of Product, Something Missing Error : ${error}`})
    }
}

module.exports = route