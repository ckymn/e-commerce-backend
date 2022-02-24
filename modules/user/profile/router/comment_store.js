const { Store_Comment } = require("../../comment/model")

const route = async (req,res,next) => {
    try {
        let { kuserData } = req;
        await Store_Comment.find({ $and: [ {author: kuserData.id},{is_approved: "yes"} ] })
          .populate({
            path: "store_id",
            select: "storename -_id",
            options: {lean: true },
          })
          .select("comment rate store_id")
          .lean()
          .exec((err, data) => {
            if (!data)
              return res
                .status(404)
                .send({ status: false, message: "No match any Data" });
            return res
              .status(200)
              .send({ status: true, message: "All of Store Comments", data });
          });
    } catch (error) {
        if(error){
            if(error.message === "MongoError" && error.code === 11000)
                return res.status(500).send({ status: false, message: `Mongo Already Exist => ${error}`})
        }
        return res.status(500).send({ status: false, message: `All of Store Comments , Mongo Missing Error => ${error}`})
    }
};

module.exports = route;