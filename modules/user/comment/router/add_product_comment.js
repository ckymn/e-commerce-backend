const { Product_Comment } = require("../model")
const { Product_Star } = require("../../star/model")
const Product = require("../../../store/products/model")
const User = require("../../auth/model")

const route = async( req,res,next) => {
    try {
        let { body ,kuserData , params} = req;
        
        // product comment
        let _data = await new Product_Comment({
            ...body,
            product_id: params.id,
            author: kuserData.id,
        }).save();
        if(!_data)
            return res.status(400).send({ status: false, message: "Add Product Comment Data Error"})
        // product update comments
        let p_data = await Product.findOneAndUpdate({ _id: params.id }, 
            {
                $push: {
                    "comments": _data._id
                }
            }, { new: true })
        if(!p_data)
            return res.status(400).send({ status: false, message: "Add Product Comment Data to Product success but Update Product Comment error"})
        // user update product_comment
        let u_data = await User.findOneAndUpdate({ _id: kuserData.id }, 
            {
                $push: {
                    "product_comment": _data._id
                }
            }, { new: true })
        if(!u_data)
            return res.status(400).send({ status: false, message: "Add Product Comment Data to User success but Update Product Comment error"})
        
        let pruduct_star = await Product_Star.create({
            rate: body.rate,
            author: kuserData.id,
            product_id: params.id,
            store_id: p_data.author,
        });
        if(!pruduct_star)
            return res.status(400).send({ status: false, message: "Product Start error"})
            
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