const Store = require("../../../store/auth/model")
const Product = require("../../../store/products/model")
const { ObjectId } = require("mongodb");
const { Store_Star } = require("../../star/model");
const ApiError = require("../../../../errors/ApiError");
const doviz = require("../../../../utils/doviz")

const route = async (req, res, next) => {
    try {
        let { kuserData ,params, query } = req; 
        let current_time = new Date();

        let _data = await Store.findOne({ _id: params.id }).lean();
        if(!_data)
          return next(new ApiError("Store not Found !",404,[]))
        let start_store = _data.counter_weekly.getDate();

        // search count - location search count
        if(Math.abs(current_time.getDate() - start_store) === 0){
            await Store.findOneAndUpdate(
              { _id: params.id },
              {
                $inc: { "search_count.1": 1, "location_search_count.1": 1 },
              }
            );
        }
        if(Math.abs(current_time.getDate() - start_store) === 1){
            await Store.findOneAndUpdate(
              { _id: params.id },
              {
                $inc: { "search_count.2": 1, "location_search_count.2": 1 },
              }
            );
        }
        if(Math.abs(current_time.getDate() - start_store) === 2){
            await Store.findOneAndUpdate(
              { _id: params.id },
              {
                $inc: { "search_count.3": 1, "location_search_count.3": 1 },
              }
            );
        }
        if(Math.abs(current_time.getDate() - start_store) === 3){
            await Store.findOneAndUpdate(
              { _id: params.id },
              {
                $inc: { "search_count.4": 1, "location_search_count.4": 1 },
              }
            );
        }
        if(Math.abs(current_time.getDate() - start_store)=== 4){
            await Store.findOneAndUpdate(
              { _id: params.id },
              {
                $inc: { "search_count.5": 1, "location_search_count.5": 1 },
              }
            );
        }
        if(Math.abs(current_time.getDate() - start_store)=== 5){
            await Store.findOneAndUpdate(
              { _id: params.id },
              {
                $inc: { "search_count.6": 1, "location_search_count.6": 1 },
              }
            );
        }
        if(Math.abs(current_time.getDate() - start_store)=== 6){
            await Store.findOneAndUpdate(
              { _id: params.id },
              {
                $inc: { "search_count.7": 1, "location_search_count.7": 1 },
              }
            );
        }
        if (Math.abs(current_time.getDate() - start_store) === 7){
          await Store.findOneAndUpdate(
            { _id: params.id },
            {
              $set: {
                "search_count.1": 0,
                "search_count.2": 0,
                "search_count.3": 0,
                "search_count.4": 0,
                "search_count.5": 0,
                "search_count.6": 0,
                "search_count.7": 0,
                "location_search_count.1": 0,
                "location_search_count.2": 0,
                "location_search_count.3": 0,
                "location_search_count.4": 0,
                "location_search_count.5": 0,
                "location_search_count.6": 0,
                "location_search_count.7":0,
                "counter_weekly": new Date(+new Date()+7*24*3600*1000)
              },
            }
          );
        }
        // store view
        await Store.findOneAndUpdate(
          { $and: [{ _id: params.id }, { $nin: [kuserData.id] }] },
          { $push: { 
              view: kuserData.id,
              last_views_weekly: kuserData.id,
              last_views_monthly: kuserData.id 
            } 
          }
        )
          .lean()
          .exec();
        // store 
        let store = await Store.aggregate([
          {
            $geoNear: {
              near: {
                type: "Point",
                coordinates: [parseFloat(query.long), parseFloat(query.lat)],
              },
              spherical: true,
              maxDistance: query.dst
                ? parseFloat(query.dst) * 1609.34
                : 900 * 1609.34,
              distanceMultiplier: 1 / 1609.34,
              distanceField: "StoreDst",
            },
          },
          {
            $match: { _id: ObjectId(params.id)}
          },
          {
            $project:{
              _id: 1,
              storedistrict:1,
              storename: 1,
              storeimg: 1,
              follow_count: { $cond: { if: { $isArray: "$follow" }, then: { $size: "$follow" }, else: "NA"} },
              star_count: { $cond: { if: { $isArray: "$star" }, then: { $size: "$star" }, else: "NA"}},
              phone:1,
              description: 1,
              is_follow: { $in: [ObjectId(kuserData.id), "$follow"] },
              store_dst: "$StoreDst"
            }
          }
        ]);
        // store star avarage
        let s_avg = await Store_Star.aggregate([
          { $match: { store_id: ObjectId(params.id) } },
          { $group: { _id: "avg_rate", rate: { $avg: "$rate" } } },
        ]);
        let store_star_avg = s_avg[0] ? s_avg[0].rate : 0
        // product of store
        let product = await Product.aggregate([
          {
            $match:{ 
              $and:[
                { author: ObjectId(params.id)},
                { is_approved: "yes" }
              ]
            }
          },
          {
            $project: {
              title: 1,
              price: { $arrayElemAt: ["$variants.sizes.price",0]},
              min_price: { $arrayElemAt: ["$variants.sizes.min_price",0]},
              img: { $arrayElemAt: ["$variants.images.url",0]},
              is_favorite:{ $in:[ObjectId(kuserData.id),"$favorite"]},
            }
          }
        ])
        // doviz
        let currency = await doviz();

        return res.send({
          status: 200,
          message: "Single Store and Products of Store find Success",
          data: {
            store,
            store_star_avg,
            product,
            currency,
          },
        });
    }catch (error) {
      if (error.name === "MongoError" && error.code === 11000) {
        next(new ApiError(error?.message, 422));
      }
      if (error.code === 27) {
        next(new ApiError("We Don't Have Any Data", 204, null));
      }
      next(new ApiError(error?.message));
    }
}
module.exports = route