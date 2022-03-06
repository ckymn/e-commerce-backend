const { ObjectId } = require("mongodb");
const Products = require("../../../store/products/model")

const route = async (req,res,next) => {
    try {
        let { params, query ,kuserData} = req;
        let data = await Products.aggregate([
          { $match: { _id: ObjectId(params.id) } },
          {
            $lookup: {
              from: "product_comments",
              let: { comments: "$comments" },
              pipeline: [
                { $match: { $expr: { $in: ["$_id", "$$comments"] } } },
                { $project: { _id: 0 } }, // suppress _id
              ],
              as: "product_of_comments",
            },
          },
          {
            $lookup: {
              from: "product_stars",
              let: { star: "$star" },
              pipeline: [
                { $match: { $expr: { $in: ["$_id", "$$star"] } } },
                { $project: { _id: 0 } }, // suppress _id
              ],
              as: "product_of_star",
            },
          },
          {
            $lookup: {
              from: "users",
              let: { favorite: "$favorite" },
              pipeline: [
                { $match: { $expr: { $in: ["$_id", "$$favorite"] } } },
                { $project: { _id: 0 } }, // suppress _id
              ],
              as: "product_of_favorite",
            },
          },
          {
            $project:{
                _id:0,
                item: "$$ROOT",
                is_favorite:{ $in:[ObjectId(kuserData.id),"$favorite"]},
            }
          }
        ]);
        return res
          .status(200)
          .send({
            status: true,
            message: "Single Products and Stories are success ",
            data,
          });
    } catch (error) {
        if(error){
            if(error.name === "MongoError" && error.code === 11000)
                return res.status(500).send({ status: false, message: `File Already exists: ${error}`})
        }
        return res.status(500).send({ status: false, message: `User Single Product ,Something Missing => ${error}`})
    }
};

module.exports = route;