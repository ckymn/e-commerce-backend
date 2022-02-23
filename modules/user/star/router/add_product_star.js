const { Product_Star } = require("../model")
const Product = require("../../../store/products/model")

const route = async( req,res,next) => {
    try {
        let { body ,kuserData , params} = req;
        let store = await Product.findOne({ _id: params.id });
        console.log(store.author)
        await Product_Star.findOne({ $and:[{product_id: params.id},{author: kuserData.id}] })
            .lean().exec(async(err,data) => {
                if(!data){
                    await Product_Star.create({
                        rate: body.rate,
                        author: kuserData.id,
                        product_id: params.id,
                        store_id: store.author,
                    },async (err,data) => {
                        if(err)
                            return res.status(400).send({ status: false, message: "Create Star Error !"})
                        let p_data = await Product.findOneAndUpdate({ _id: params.id },
                            {
                                $push: {
                                    "star": data._id
                                }
                            }, { new: true })
                        if(!p_data)
                            return res.status(400).send({ status: false, message: "Update Product Star Data success "})
                        })
                    return res.status(200).send({ status: true, message: "User to Product Comment Success", data })
                }
                return res.status(400).send({ status: false, message: "Add Product Star Already Exist ! "})
            })
    } catch (error) {
        if(error){
            if(error.name === "MongoError" && error.code === 11000)
                return res.status(500).send({ status: false, message: `Mongo Error ${error}`})
        }
        return res.status(500).send({ status: false, message: `User Comment Add of Product, Something Missing Error : ${error}`})
    }
}

module.exports = route