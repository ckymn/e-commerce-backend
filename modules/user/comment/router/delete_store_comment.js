const { Store_Comment } = require("../model")
const Store = require("../../../store/auth/model")

const route = async( req,res,next) => {
    try {
        let { body ,kuserData , params} = req;
        if(kuserData.role != "user")
            return res.status(400).send({ status: false, message: "You cannot add comment , firstly you can be user" })
        if(kuserData.role === "user"){
            await Store_Comment.findOneAndRemove({ $and: [ { author: kuserData.id },{ _id: params.id } ] }).lean().exec(async (err,data) => {
                if(err)
                    return res.status(400).send({ status: false, message: "Delete Store Comment failed"})
                await Store.updateOne({ _id: data.store_id},
                    {
                        $pull: {
                            comment: {
                                $in: data._id
                            }
                        }
                    }).lean().exec((err,data) => {
                        if(err)
                            return res.status(400).send({ status: false, message: "Delete Store Comment success but Stores Comment update faliled"})
                        return res.status(200).send({ status: true, message: "Delete Store Comment and Stores comment success "})
                    })
            })
        }
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