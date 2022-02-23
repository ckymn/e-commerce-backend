const Data = require("../../auth/model"),
  Product = require("../../products/model"),
  { Store_Comment, Product_Comment } = require("../../../user/comment/model"),
  Storie = require("../../story/model"),
  Advertisement = require("../../advertisement/model"),
  Store = require("../../auth/model");

const route = async (req, res, next) => {
  try {
    let { userData } = req;

    let _products = await Product.find({
      $and: [{ author: userData.id }, { is_approved: "yes" }],
    }).lean();

    let _store_comments = await Store_Comment.find({ store_id: userData.id })
      .populate({ path: "author" })
      .lean();

    let _product_comments = await Product.find({
      $and: [{ author: userData.id }, { is_approved: "yes" }],
    })
      .select("comments")
      .populate({ path: "comments" })
      .lean();

    let _stories = await Storie.find({ author: userData.id })
      .populate({ path: "view" })
      .count()
      .lean();

    let _ads = await Advertisement.find({
      $and: [{ author: userData.id }, { is_approved: "yes" }],
    }).lean();

    let _store_info = await Store.find({
      $and: [{ _id: userData.id }, { is_approved: "yes" }],
    }).lean();

    let _follow = await Store.find({
      $and: [{ _id: userData.id }, { is_approved: "yes" }],
    })
      .select("follow -_id")
      .populate({ path: "follow", select: "username" })
      .lean();

    let _last_view_day = await Store.aggregate([
      {
        $project: {
          _id: 0,
          view: 1,
          day: {
            $cond: {
              if: {
                $and:[
                  {$gte: ["date","date" - 24 * 60 * 60 * 1000]},
                  {$lte: ["date","date" + 30 * 24 * 60 * 60 * 1000]},
                ]
              },
              then: { $size: "$view" },
              else: "NA",
            },
          },
        },
      },
    ]);
    let _last_view_month = await Store.aggregate([
      {
        $project: {
          _id: 0,
          view: 1,
          day: {
            $cond: {
              if: {
                $gte: [
                  "date",
                  new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                ],
              },
              then: { $size: "$view" },
              else: "NA",
            },
          },
        },
      },
    ]);
    let _last_view_year = await Store.aggregate([
      {
        $project: {
          _id: 0,
          view: 1,
          day: {
            $cond: {
              if: {
                $gte: [
                  "date",
                  new Date(Date.now() + 360 * 24 * 60 * 60 * 1000),
                ],
              },
              then: { $size: "$view" },
              else: "NA",
            },
          },
        },
      },
    ]);

    // let _last_sells = await Store.find({
    //   $and: [{ _id: userData.id }, { is_approved: "yes" }],
    // })
    //   .populate({ path: "follow", select: "username" })
    //   .lean()
    //   .exec((_, data) => {
    //     if (!data) {
    //       return res.status(404).send({
    //         status: false,
    //         message: "Store/store_home/home_page ,Don't Match Follow Data",
    //       });
    //     }
    //   });
    return res.status(200).send({
      status: true,
      message: "Store Home Page Success",
      data: {
        _products,
        _store_comments,
        _product_comments,
        _stories,
        _ads,
        _store_info,
        _ads,
        _follow,
        _last_view_day
      },
    });
  } catch (error) {
    if (error) {
      if (error.name === "MongoError" && error.code === 11000)
        return res.status(error.code).send({
          status: false,
          message: `Find Store, MongoError Database Already Exist : ${error}`,
        });
    }
    return res
      .status(500)
      .send({ status: false, message: `Find Store, Missing Error : ${error}` });
  }
};
module.exports = route;
