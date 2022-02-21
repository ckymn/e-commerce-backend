const { Product_Comment } = require("../model")

const route = async( req,res,next) => {
    try {
        let { body ,kuserData , params} = req;
        await Product_Comment.updateOne({ $and: [ {author: kuserData.id},{_id: params.id} ]},
            {
                $set: {
                    "comment": body.comment,
                    "rate": body.rate
                }
            }
        ).exec(async(err,data) => {
            if(data.matchedCount === 0)
                return res.status(400).send({ status: false, message: "Update Product Comment Data Error"})
            return res.status(200).send({ status: true, message: "User to Update Product Comment Success" })
        })
    } catch (error) {
        if(error){
            if(error.name === "MongoError" && error.code === 11000)
                return res.status(500).send({ status: false, message: `Mongo Error ${error}`})
        }
        return res.status(500).send({ status: false, message: `User Updatre Comment of Product, Something Missing Error : ${error}`})
    }
}

module.exports = route