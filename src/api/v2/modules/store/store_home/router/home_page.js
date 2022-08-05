const { ObjectId } = require("mongodb");
const Data = require("../../auth/model"),
  { Store_Comment } = require("../../../user/comment/model"),
  StoreFollow = require("../../../user/follow/model"),
  { Star: { Product_Star }} = require("../../../user/comment/model"),
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

    //store avg
    let s_avg = await Product_Star.aggregate([
      { $match: { store_id: ObjectId(userData.id) } },
      { $group: { _id: "avg_rate", rate: { $avg: "$rate" } } },
    ]);
    let total_store_point = s_avg[0] ? s_avg[0].rate : 0
    //product avg
    let p_avg = await Product_Star.aggregate([
      { $match: { store_id: ObjectId(userData.id) } },
      { $group: { _id: "avg_rate", rate: { $avg: "$rate" } } },
    ]);
    let total_product_point =  p_avg[0] ? p_avg[0].rate : 0
    
    //sells
    let sells_daily = await Payment.aggregate([
      {
        $addFields: {
          month: { $month: "$date" },
          day: { $dayOfMonth: "$date" },
        },
      },
      {
        $match: {
          $and: [
            { day: current_time.getDate() },
            { month: current_time.getMonth()+1 },
          ],
        },
      },
    ]);
    let sells_weekly = await Payment.aggregate([
      {
        $addFields: {
          month: { $month: "$date" },
          day: { $dayOfMonth: "$date" },
        },
      },
      {
        $match: {
          $and: [
            { day: { $lte: current_time.getDate()+7 } },
            { month: current_time.getMonth()+1 },
          ],
        },
      },
    ]);
    let sells_monthly = await Payment.aggregate([
      {
        $addFields: {
          month: { $month: "$date" },
          day: { $dayOfMonth: "$date" },
        },
      },
      {
        $match: {
          $and: [
            { day: { $lte: current_time.getDate()+28 } },
            { month: current_time.getMonth()+1 },
          ],
        },
      },
    ]);

    //
    if(Math.abs(current_time.getDate() - store.counter_weekly.getDate()) === 7){
      console.log("haftada")
      await Data.findOneAndUpdate({_id: userData.id },{
        $set: {
          "counter_weekly": new Date(+new Date()+7*24*3600*1000), 
          "last_views_weekly": []
        }
      })
    }
    if(Math.abs(current_time.getDate() - store.counter_monthly.getDate()) === 28){
      console.log("ayda")
      await Data.findOneAndUpdate({_id: userData.id },{
        $set: { 
          "counter_weekly": new Date(+new Date()+30*24*3600*1000),
          "last_views_weekly": [],
          "last_views_monthly": [] 
        }
      })
    }

    let monthly_views = store.last_views_monthly.length;
    let weekly_views = store.last_views_weekly.length;
    let daily_views = store.view.length;
    
    let wp_msg_count = Object.values(store.wp_msg_count);
    let search_count = Object.values(store.search_count);
    let location_search_count = Object.values(store.location_search_count)
    let last_sells = [sells_monthly.length,sells_weekly.length,sells_daily.length];
    let last_views = [ monthly_views,weekly_views,daily_views];

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
        // total_comments,
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
