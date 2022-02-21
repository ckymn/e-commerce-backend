const Data = require("../model")

const route = async (req, res, next) => {
    try {
        let { id } = req.userData;

        let d_w = await Data.find({ $and: [ { author: id },{"is_approved": { $in: "wait"}} ] }).lean();
        let d_n = await Data.find({ $and: [ { author: id },{"is_approved": { $in: "no"}} ] }).lean();
        let d_y = await Data.find({
          $and: [{ author: id }, { is_approved: { $in: "yes" } }],
        })
          .populate({
            path: "comments",
            populate: {
              path: "author",
              select: "name surname",
            },
            options: { lean: true },
          })
          .populate({ path: "star", select: "rate", options: { lean: true } })
          .lean()
          .exec();
       
        if(!d_w.length && !d_n.length && !d_y.length)
            return res.status(404).send({ status: false, message: "You don't have any items. Add product to see"})
        return res.status(200).send({ status: true, message: "All Product status here", data: { d_w, d_n, d_y } })
    } catch (error) {
        if(error){
            if(error.name === "MongoError" && error.code === 11000)
                return res.status(500).send({ status: false, message: `File Already exists!  : ${error}` })
        }
        return res.status(500).send({ status: false, message: `All Products Error Cannot Upload Something Missing => ${error}`})
    }
}

module.exports = route