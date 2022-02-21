const { Store_Star } = require("../model")
const Store = require("../../../store/auth/model")

const route = async( req,res,next) => {
    try {
        let { body ,kuserData , params} = req;
        await Store_Star.findOneAndRemove({ $and:[{ product_id: params.id }, { author: kuserData.id }] })
            .lean().exec(async(err,data) => {
                if(err)
                    return res.status(400).send({ status: false, message: "Delete Star Error"})
                let p_data = await Store.updateOne({ _id: params.id },
                    {
                        $pull: {
                            star:{
                                $in: data._id
                            }
                        }
                    })
                if(p_data.matchedCount === 0)
                    return res.status(400).send({ status: false, message: "Delete Store Star Data Fail ! "})
                return res.status(200).send({ status: true, message: "User Delete Store Comment Success"})
            })
        
    } catch (error) {
        if(error){
            if(error.name === "MongoError" && error.code === 11000)
                return res.status(500).send({ status: false, message: `Mongo Error ${error}`})
        }
        return res.status(500).send({ status: false, message: `User Comment Delete of Store, Something Missing Error : ${error}`})
    }
}

module.exports = route