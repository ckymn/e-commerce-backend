const { Product_Comment } = require("../../../user/comment/model")
const Product = require("../../../store/products/model")
const User = require("../../../user/auth/model")


const route = async (req,res,next) => {
    try {
        let { params } = req;
        await Product_Comment.findOne({ _id: params.id })
        .lean().exec(async(err,data) =>{
            if(!data)
                return  res.status(404).send({ status: false, message: "Not match any Product Comment "})
            if(data.is_approved === "wait"){
                if(is_approved === "no"){
                    await Product_Comment.findOneAndDelete({ _id: params.id })
                    .lean().exec(async(err,data) => {
                        if(data.deletedCount === 0)
                            return res.status(400).send({ status: false, message: "Delete Product_Comment by Admin Failed"})
                            await Product.updateOne({ _id: data.product_id },
                                {
                                    $pull: {
                                        comments: {
                                            $in: data._id
                                        }
                                    }
                                }
                            ).lean().exec(async(err,data) =>{
                                if(err)
                                    return res.status(400).send({ status: false, message: "Delete Comment of Product by Admin Failed"})
                            })
                            await User.updateOne({ _id: data.author },
                                {
                                    $pull: {
                                        product_comment: {
                                            $in: data._id
                                        }
                                    }
                                }
                            ).lean().exec(async(err,data) =>{
                                console.log(data)
                                if(err)
                                    return res.status(400).send({ status: false, message: "Delete Comment of User by Admin Failed"})
                            })
                    })
                }
            }
            return res.status(200).send({ status: true, message: "Product Comments Changing by Admin success " })
        })
    } catch (error) {
        if(error){
            if(error.name === "MongoError" && error.code === 11000)
                return res.status(500).send({ status: false, message: `Mongo Error Product Comments Find => ${error}`})
        }
        return res.status(500).send({ status: false, message: `Products Comments Find, Something Missing Error : ${error}`})
    }
};

module.exports = route  