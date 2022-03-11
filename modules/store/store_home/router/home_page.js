const { ObjectId } = require("mongodb");
const Data = require("../../auth/model"),
  { Store_Comment } = require("../../../user/comment/model"),
  StoreFollow = require("../../../user/follow/model"),
  { Store_Star , Product_Star} = require("../../../user/star/model"),
  Payment = require("../../payment/model"),
  ApiError = require("../../../../errors/ApiError");


const route = async (req, res, next) => {
  try {
    let { userData } = req;
    let current_time = new Date();
    let store = await Data.findOne({ _id: userData.id }).lean();

    let total_followers = await StoreFollow.find({ store_id: userData.id })
    .count()
    .lean()
    .exec();

    let total_comments = await Store_Comment.find({ store_id: userData.id })
      .count()
      .lean()
      .exec();
    //avg
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
    
    //sells
    let seller = await Payment.aggregate([
      {$addFields:{"day":{$dayOfMonth:"$date"}}},
      {$match:{ day: current_time.getDate()}}
    ])
    let total_daily_seller = seller.map(i => i._id);
    await Data.findOneAndUpdate(
      {
        $and: [
          { _id: userData.id },
          { last_sells_weekly: { $nin: [total_daily_seller] } },
        ],
      },
      {
        $push: {
          last_sells_weekly: total_daily_seller,
          last_sells_monthly: total_daily_seller,
        },
      }
    );
    if(Math.abs(current_time.getDate() - store.counter_weekly.getDate()) === 7){
      console.log("haftada")
      await Data.findOneAndUpdate({_id: userData.id },{
        $set: {
          "counter_weekly": new Date(+new Date()+7*24*3600*1000), 
          "last_sells_weekly": [],
          "last_views_weekly": []
        }
      })
    }
    if(Math.abs(current_time.getDate() - store.counter_monthly.getDate()) === 28){
      console.log("ayda")
      await Data.findOneAndUpdate({_id: userData.id },{
        $set: { 
          "counter_weekly": new Date(+new Date()+30*24*3600*1000),
          "last_sells_weekly": [],
          "last_sells_monthly": [],
          "last_views_weekly": [],
          "last_views_monthly": [] 
        }
      })
    }

    let monthly_sells = store.last_sells_monthly.length;
    let weekly_sells = store.last_sells_weekly.length;
    let daily_sells = total_daily_seller.length;
    let last_sells = [monthly_sells,weekly_sells,daily_sells];

    let monthly_views = store.last_views_monthly.length;
    let weekly_views = store.last_views_weekly.length;
    let daily_views = store.view.length;
    let last_views = [ monthly_views,weekly_views,daily_views];

    let wp_msg_count = Object.values(store.wp_msg_count);
    let search_count = Object.values(store.search_count);
    let location_search_count = Object.values(store.location_search_count)

    return res.send({
      status: 200,
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
    console.log(error)
    if (error.name === "MongoError" && error.code === 11000) {
      next(new ApiError(error?.message, 422));
    }
    if (error.code === 27) {
      next(new ApiError("We Don't Have Any Data", 204, []));
    }
    next(new ApiError(error?.message));
  }
};
module.exports = route;
