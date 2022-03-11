const { Store_Comment } = require("../model")

const route = async( req,res,next) => {
    try {
        let { body ,kuserData , params} = req;
        await Store_Comment.updateOne({ $and: [ {author: kuserData.id},{_id: params.id} ]},
            {
                $set: {
                    "comment": body.comment,
                    "rate": body.rate
                }
            }
        ).exec(async(err,data) => {
            if(data.matchedCount === 0)
                return res.status(400).send({ status: false, message: "Update Store Comment Data Error"})
            return res.send({ status: 200, message: "User to Update Store Comment Success" })
        })
    } catch (error) {
        console.log(error);
        if(error){
            if(error.name === "MongoError" && error.code === 11000)
                return res.status(500).send({ status: false, message: `Mongo Error ${error}`})
        }
        return res.status(500).send({ status: false, message: `User Comment Add of Store, Something Missing Error : ${error}`})
    }
}

module.exports = route