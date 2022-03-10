const Data = require("../../auth/model")
const Products = require("../../../store/products/model")
const AdminData = require("../../../admin/login/model")
const ActiveUser = require("../../../../middlewares")
const AdminAdsStory = require("../../../admin/advertisement/model")
const StoreAds = require("../../../store/advertisement/model")
const ApiError = require("../../../../errors/ApiError")
const { ObjectId } = require("mongodb")
const doviz = require("../../../../utils/doviz")

const route = async (req,res,next) => {
    try {
        let { kuserData ,params, query ,body } = req;
        let actives = [];
        let current_time = new Date();
        
        // user find- location update
        let _data = await Data.findOneAndUpdate({ _id: kuserData.id },
          {
            $set: {
              "location.coordinates": [
                parseFloat(query.long),
                parseFloat(query.lat),
              ],
            },
          }
        );
        if(!_data)
          return next(new ApiError("Didn't find User",204,_data));
        // active users find
        await ActiveUser.active.active_control(req.active);
        for(let [key,value] of req.active){
            actives.push(key);            
        }
        await AdminData.findOneAndUpdate({ role: { $in: ["admin"] } },
            { 
                $set: {
                    active: actives.map(i => i)
                }
            }
        );
        
        if(query.search){
          let product_data = await Products.aggregate([
            {
              $geoNear: {
                near: {
                  type: "Point",
                  coordinates: [parseFloat(query.long), parseFloat(query.lat)],
                },
                spherical: true,
                maxDistance: query.dst
                  ? parseFloat(query.dst) * 1609.34
                  : 10 * 1609.34,
                distanceMultiplier: 1 / 1609.34,
                distanceField: "ProductDst",
              },
            },
            {
              $match: {
                $and: [
                  {
                    $or:[
                      // { $text: { $search: query.search } },
                      { title: {$regex: query.search , $options: "i"} }
                    ]
                  },
                  {
                    is_approved: "yes",
                  },
                  {
                    store_open_hour: {
                      $lte: query.hour ? parseInt(query.hour) : 25,
                    },
                  },
                  {
                    store_close_hour: {
                      $gte: query.hour ? parseInt(query.hour) : 0,
                    },
                  },
                  {
                    "variants.sizes": {
                      $elemMatch: {
                        price: {
                          $gte: query.minPrc ? parseFloat(query.minPrc) : 0,
                          $lte: query.maxPrc ? parseFloat(query.maxPrc) : 1000000,
                        },
                      },
                    },
                  },
                ],
              },
            },
            {
              $project: {
                _id: 0,
                item: "$$ROOT",
                is_favorite:{ $in:[ObjectId(kuserData.id),"$favorite"]},
              }
            },
            { $skip: parseInt(query.skip) },
            { $limit: parseInt(query.limit) },
          ]);
          let admin_ads_story = await AdminAdsStory.aggregate([
            {
              $geoNear: {
                near: {
                  type: "Point",
                  coordinates: [parseFloat(query.long), parseFloat(query.lat)],
                },
                spherical: true,
                maxDistance: query.dst
                  ? parseFloat(query.dst) * 1609.34
                  : 10 * 1609.34,
                distanceMultiplier: 1 / 1609.34,
                distanceField: "AdminStoryDst",
              },
            },
            {
              $match: {
                $and: [
                  {
                    banner_story_time: { $gte: current_time },
                  },
                  { ads_which: "Story" },
                ],
              },
            },
          ]);
          let store_ads_story = await StoreAds.aggregate([
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
                distanceField: "StoreStoryDst",
              },
            },
            {
              $match:{
                $and:[
                  { is_approved: "yes" },
                  { banner_story_time: { $gte: current_time } },
                  { ads_which: "Story"  }
                ]
              }
            }
          ])
          let currency = await doviz();

          return res
          .status(200)
          .send({
            status: true,
            message: "Products and StoreStory are success ",
            data: { product_data, admin_ads_story ,store_ads_story,currency},
          });
        }else{
          let product_data = await Products.aggregate([
            {
              $geoNear: {
                near: {
                  type: "Point",
                  coordinates: [parseFloat(query.long), parseFloat(query.lat)],
                },
                spherical: true,
                maxDistance: query.dst
                  ? parseFloat(query.dst) * 1609.34
                  : 10 * 1609.34,
                distanceMultiplier: 1 / 1609.34,
                distanceField: "ProductDst",
              },
            },
            {
              $match: {
                $and: [
                  {
                    is_approved: "yes",
                  },
                  {
                    "variants.sizes": {
                      $elemMatch: {
                        price: {
                          $gte: query.minPrc ? parseFloat(query.minPrc) : 0,
                          $lte: query.maxPrc ? parseFloat(query.maxPrc) : 1000000,
                        }
                      },
                    },
                  },
                ],
              },
            },
            {
              $project: {
                _id: 0,
                item: "$$ROOT",
                is_favorite:{ $in:[ObjectId(kuserData.id),"$favorite"]},
              }
            },
            { $skip: parseInt(query.skip) },
            { $limit: parseInt(query.limit) },
          ]);
          let admin_ads_story = await AdminAdsStory.aggregate([
            {
              $geoNear: {
                near: {
                  type: "Point",
                  coordinates: [parseFloat(query.long), parseFloat(query.lat)],
                },
                spherical: true,
                maxDistance: query.dst
                  ? parseFloat(query.dst) * 1609.34
                  : 10 * 1609.34,
                distanceMultiplier: 1 / 1609.34,
                distanceField: "AdminStoryDst",
              },
            },
            {
              $match: {
                $and: [
                  {
                    banner_story_time: { $gte: current_time },
                  },
                  { ads_which: "Story" },
                ],
              },
            },
          ]);
          let currency = await doviz();

          return res
          .status(200)
          .send({
            status: true,
            message: "Products and StoreStory are success ",
            data: { product_data, admin_ads_story ,store_ads_story,currency},
          });
        }
    } catch (error) {
      if (error.name === "MongoError" && error.code === 11000) {
        return next(new ApiError(error?.message, 422));
      }
      if (error.code === 27) {
        return next(new ApiError("We Don't Have Any Data", 404, {
          store_ads_story:[],
          product_data:[],
          admin_ads_story:[],
          currency:[]
        }));
      }
      return next(new ApiError(error?.message));
    }
};

module.exports = route;