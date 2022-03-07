const { ObjectId } = require("mongodb");
const Data = require("../../auth/model"),
  { Store_Comment } = require("../../../user/comment/model"),
  Store = require("../../auth/model"),
  StoreFollow = require("../../../user/follow/model"),
  { Store_Star , Product_Star} = require("../../../user/star/model"),
  mongoose = require("mongoose"),
  Payment = require("../../payment/model"),
  ApiError = require("../../../../errors/ApiError");


const route = async (req, res, next) => {
  try {
    let { userData } = req;
    let current_time = new Date();

    let total_followers = await StoreFollow.find({ store_id: userData.id })
    .count()
    .lean()
    .exec();

    let total_comments = await Store_Comment.find({ store_id: userData.id })
      .count()
      .lean()
      .exec();

    let s_avg = await Store_Star.aggregate([
      { $match: { store_id: ObjectId(userData.id) } },
      { $group: { _id: "avg_rate", rate: { $avg: "$rate" } } },
    ]);
    let total_store_point = s_avg[0] ? s_avg[0].rate : 0

    let p_avg = await Product_Star.aggregate([
      { $match: { store_id: ObjectId(userData.id) } },
      { $group: { _id: "avg_rate", rate: { $avg: "$rate" } } },
    ]);
    
    let total_product_point =  p_avg[0] ? p_avg[0].rate : 0
    
    //whatsapp_view
    let wp = await Store.findOne({ _id: userData.id }).lean();
    //last_view [ burda da $dayOfMonth array de calismiyor]
    let v_1 = await Store.aggregate([
      {
        $match: {
          $and: [
            { _id: ObjectId(userData.id) },
            { "view.date": { $lte: new Date() } },
          ],
        },
      },
      {
        $project: {
          _id: 0,
          total_daily: { $size: "$view"}
        },
      }
    ]);
    let v_2 = await Store.aggregate([
      {
        $match: {
          $and: [
            { _id: ObjectId(userData.id) },
            { "view.date": { $gte: new Date() , $lte: new Date(+new Date() +7 * 24 * 60 * 60 * 1000) } },
          ],
        },
      },
      {
        $project: {
          _id: 0,
          total_weekly: { $size: "$view"}
        },
      }
    ]);
    let v_3 = await Store.aggregate([
      {
        $match: {
          $and: [
            { _id: ObjectId(userData.id) },
            { "view.date": { $gte: new Date(+new Date() +7 * 24 * 60 * 60 * 1000) , $lte: new Date(+new Date() +30 * 24 * 60 * 60 * 1000) } },
          ],
        },
      },
      {
        $project: {
          _id: 0,
          total_monthly: { $size: "$view"}
        },
      }
    ]);
    // last_seller [ burda author:ObjectId(calismiyor)]
    let s_1 = await Payment.aggregate([
      {
        $project:{
          day: { $dayOfMonth: "$created_at"}
        }
      },
      {
        $match: {
          $and: [
            { author: ObjectId(userData.id) },
            { day: { $eq: current_time.getDate() } },
          ],
        },
      },
      {
        $count: "total_daily" 
      }
    ]);
    let s_2 = await Payment.aggregate([
      {
        $match: {
          $and: [
            { author: ObjectId(userData.id) },
            { date: { $gte: new Date() , $lte: new Date(+new Date() +7 * 24 * 60 * 60 * 1000) } },
          ],
        },
      },
      {
        $count: "total_weekly" 
      }
    ]);
    let s_3 = await Payment.aggregate([
      {
        $match: {
          $and: [
            { author: ObjectId(userData.id) },
            { date: { $gte: new Date(+new Date() +7 * 24 * 60 * 60 * 1000) , $lte: new Date(+new Date() +30 * 24 * 60 * 60 * 1000) } },
          ],
        },
      },
      {
        $count: "total_monthly" 
      }
    ]);
    // search_count
    let sc_lc = await Store.findOne({ _id: userData.id }).lean();
    
    
    const r = await Store.findOneAndUpdate({ _id: userData.id },
      { $set: { 
        "last_views.daily": v_1[0] ? v_1[0].total_daily : 0,
        "last_views.weekly": v_2[0] ? v_2[0].total_weekly : 0,
        "last_views.monthly": v_3[0] ? v_3[0].total_monthly : 0,
        "last_sells.daily": s_1[0] ? s_1[0].total_daily : 0,
        "last_sells.weekly": s_2[0] ? s_2[0].total_weekly : 0,
        "last_sells.monthly": s_3[0] ? s_3[0].total_monthly : 0,
      } }
    );
    let last_views = [ r.last_views.monthly, r.last_views.weekly, r.last_views.daily];
    let last_sells = [ r.last_sells.monthly, r.last_sells.weekly, r.last_sells.daily];
    let wp_msg_count = Object.values(wp.wp_msg_count);
    let search_count = Object.values(sc_lc.search_count);
    let location_search_count = Object.values(sc_lc.location_search_count)

    return res.status(200).send({
      status: true,
      message: "Store Home Page Success",
      data: {
        search_count,
        location_search_count,
        wp_msg_count,
        last_sells,
        last_views,
        total_followers,
        total_comments,
        total_product_point,
        total_store_point, 
      },
    });
  } catch (error) {
    if (error.name === "MongoError" && error.code === 11000) {
      next(new ApiError(error?.message, 422));
    }
    if (error.code === 27) {
      next(new ApiError("We Don't Have Any Data", 500, null));
    }
    next(new ApiError(error?.message));
  }
};
module.exports = route;
