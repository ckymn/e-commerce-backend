const Data = require("../../auth/model"),
  Product = require("../../products/model"),
  { Store_Comment, Product_Comment } = require("../../../user/comment/model"),
  Storie = require("../../story/model"),
  Advertisement = require("../../advertisement/model"),
  Store = require("../../auth/model"),
  StoreFollow = require("../../../user/follow/model"),
  { Store_Star , Product_Star} = require("../../../user/star/model"),
  mongoose = require("mongoose"),
  ObjectId = mongoose.Types.ObjectId,
  Payment = require("../../payment/model");


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

    let _total_followers = await StoreFollow.find({ store_id: userData.id })
      .count()
      .lean()
      .exec();

    let _total_comments = await Store_Comment.find({ store_id: userData.id })
    .count()
    .lean()
    .exec();

    let s_avg = await Store_Star.aggregate([
      {$match: { store_id: ObjectId(userData.id)}},
      {$group: {_id: "avg_rate", rate: {$avg: '$rate'}}}
    ])
    let _total_store_point = s_avg[0].rate

    let p_avg = await Product_Star.aggregate([
      { $match: { store_id: ObjectId(userData.id) } },
      {$group: {_id: "avg_rate", rate: {$avg: "$rate"}}}
    ]);
    console.log(p_avg)
    let _total_product_point = p_avg[0].rate

    let d_1 = await Store.aggregate([
      {
        $match: {
          $and: [
            { is_approved: "yes" },
            {
              "view.date": {
                $lte: new Date(+new Date() + 1 * 24 * 60 * 60 * 1000),
              },
            },
            { _id: ObjectId(userData.id) },
          ],
        },
      },
      { $addFields: { daily: { $size: "$view" } } },
      {
        $project: {
          _id: 0,
          daily: 1,
        },
      },
    ]);
    let d_2 = await Store.aggregate([
      {
        $match: {
          $and: [
            { is_approved: "yes" },
            {
              "view.date": {
                $eq: new Date(+new Date() + 2 * 24 * 60 * 60 * 1000),
              },
            },
            { _id: ObjectId(userData.id) },
          ],
        },
      },
      { $addFields: { daily: { $size: "$view" } } },
      {
        $project: {
          _id: 0,
          daily: 1
        },
      }
    ])
    let d_3 = await Store.aggregate([
      {
        $match: {
          $and: [
            { is_approved: "yes" },
            {
              "view.date": {
                $eq: new Date(+new Date() + 3 * 24 * 60 * 60 * 1000),
              },
            },
            { _id: ObjectId(userData.id) },
          ],
        },
      },
      { $addFields: { daily: { $size: "$view" } } },
      {
        $project: {
          _id: 0,
          daily: 1
        },
      }
    ])
    let d_4 = await Store.aggregate([
      {
        $match: {
          $and: [
            { is_approved: "yes" },
            {
              "view.date": {
                $eq: new Date(+new Date() + 4 * 24 * 60 * 60 * 1000),
              },
            },
            { _id: ObjectId(userData.id) },
          ],
        },
      },
      { $addFields: { daily: { $size: "$view" } } },
      {
        $project: {
          _id: 0,
          daily: 1
        },
      }
    ])
    let d_5 = await Store.aggregate([
      {
        $match: {
          $and: [
            { is_approved: "yes" },
            {
              "view.date": {
                $eq: new Date(+new Date() + 5 * 24 * 60 * 60 * 1000),
              },
            },
            { _id: ObjectId(userData.id) },
          ],
        },
      },
      { $addFields: { daily: { $size: "$view" } } },
      {
        $project: {
          _id: 0,
          daily: 1
        },
      }
    ])
    let d_6 = await Store.aggregate([
      {
        $match: {
          $and: [
            { is_approved: "yes" },
            {
              "view.date": {
                $eq: new Date(+new Date() + 6 * 24 * 60 * 60 * 1000),
              },
            },
            { _id: ObjectId(userData.id) },
          ],
        },
      },
      { $addFields: { daily: { $size: "$view" } } },
      {
        $project: {
          _id: 0,
          daily: 1
        },
      }
    ])
    let d_7 = await Store.aggregate([
      {
        $match: {
          $and: [
            { is_approved: "yes" },
            {
              "view.date": {
                $eq: new Date(+new Date() + 7 * 24 * 60 * 60 * 1000),
              },
            },
            { _id: ObjectId(userData.id) },
          ],
        },
      },
      { $addFields: { daily: { $size: "$view" } } },
      {
        $project: {
          _id: 0,
          daily: 1
        },
      }
    ])
    let d_30 = await Store.aggregate([
      {
        $match: {
          $and: [
            { is_approved: "yes" },
            {
              "view.date": {
                $eq: new Date(+new Date() +30 * 24 * 60 * 60 * 1000),
              },
            },
            { _id: ObjectId(userData.id) },
          ],
        },
      },
      { $addFields: { daily: { $size: "$view" } } },
      {
        $project: {
          _id: 0,
          daily: 1
        },
      }
    ]);
    let d_360 = await Store.aggregate([
      {
        $match: {
          $and: [
            { is_approved: "yes" },
            {
              "view.date": {
                $eq: new Date(+new Date() + 360 * 24 * 60 * 60 * 1000),
              },
            },
            { _id: ObjectId(userData.id) },
          ],
        },
      },
      { $addFields: { daily: { $size: "$view" } } },
      {
        $project: {
          _id: 0,
          daily: 1
        },
      }
    ]);
    let _last_view_daily;
    let _last_view_weekly;
    let _last_view_monthly;
    let _last_view_yearly;
    if(d_1.length > 0)
      _last_view_daily = d_1[0].daily;
    if(d_1.length > 0 && d_2.length > 0 && d_3.length > 0 && d_4.length > 0 && d_5.length > 0 && d_6.length > 0 && d_7.length > 0)
      _last_view_weekly = [d_1[0].daily,d_2[0].daily,d_3[0].daily,d_4[0].daily,d_5[0].daily,d_6[0].daily,d_7[0].daily]
    if(d_30.length > 0)
      _last_view_monthly = d_30[0].daily
    if(d_360.length > 0)
      _last_view_yearly = d_360[0].daily

    let s_1 = await Payment.aggregate([
      {
        $match: {
          $and: [
            { author: ObjectId(userData.id) },
            { date: { $lte: new Date(+new Date() + 1 * 24 * 60 * 60 * 10000) } },
          ],
        },
      },
    ]);
    let s_2 = await Payment.aggregate([
      {
        $match: {
          $and: [
            { author: ObjectId(userData.id) },
            { date: { $eq: new Date(+new Date() + 2 * 24 * 60 * 60 * 10000) } },
          ],
        },
      },
    ]);
    let s_3 = await Payment.aggregate([
      {
        $match: {
          $and: [
            { author: ObjectId(userData.id) },
            { date: { $eq: new Date(+new Date() + 3 * 24 * 60 * 60 * 10000) } },
          ],
        },
      },
    ]);
    let s_4 = await Payment.aggregate([
      {
        $match: {
          $and: [
            { author: ObjectId(userData.id) },
            { date: { $eq: new Date(+new Date() + 4 * 24 * 60 * 60 * 10000) } },
          ],
        },
      },
    ]);
    let s_5 = await Payment.aggregate([
      {
        $match: {
          $and: [
            { author: ObjectId(userData.id) },
            { date: { $eq: new Date(+new Date() + 5 * 24 * 60 * 60 * 10000) } },
          ],
        },
      },
    ]);
    let s_6 = await Payment.aggregate([
      {
        $match: {
          $and: [
            { author: ObjectId(userData.id) },
            { date: { $eq: new Date(+new Date() + 6 * 24 * 60 * 60 * 10000) } },
          ],
        },
      },
    ]);
    let s_7 = await Payment.aggregate([
      {
        $match: {
          $and: [
            { author: ObjectId(userData.id) },
            { date: { $eq: new Date(+new Date() + 7 * 24 * 60 * 60 * 10000) } },
          ],
        },
      },
    ]);
    let s_30 = await Payment.aggregate([
      {
        $match: {
          $and: [
            { author: ObjectId(userData.id) },
            { date: { $eq: new Date(+new Date() + 30 * 24 * 60 * 60 * 10000) } },
          ],
        },
      },
    ]);
    let _last_sells_daily;
    let _last_sells_weekly;
    let _last_sells_monthly;
    if(s_1.length > 0)
      _last_sells_daily = s_1.length;
    if(s_1.length > 0 && s_2.length > 0 && s_3.length > 0 && s_4.length > 0 && s_5.length > 0 && s_6.length > 0 && s_7.length > 0)
      _last_sells_weekly = [s_1.length,s_2.length,s_3.length,s_4.length,s_5.length,s_6.length,s_7.length]
    if(d_30.length > 0)
      _last_sells_monthly = s_30.length
    
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
        _total_followers,
        _total_comments,
        _total_store_point, 
        _total_product_point,
        _last_view_daily,
        _last_view_weekly,
        _last_view_monthly,
        _last_view_yearly,
        _last_sells_daily,
        _last_sells_weekly,
        _last_sells_monthly,
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
