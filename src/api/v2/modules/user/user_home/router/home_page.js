const Data = require("../../auth/model")
const Products = require("../../../store/products/model")
const AdminData = require("../../../admin/login/model")
const Active = require("../../../../middlewares")
const AdminAdsStory = require("../../../admin/advertisement/model")
const ApiError = require("../../../../errors/ApiError")
const { ObjectId } = require("mongodb")
const doviz = require("../../../../utils/doviz")

const route = async (req,res,next) => {
    try {
        let { kuserData, query , active } = req;
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
          return next(new ApiError("Didn't find User",404,null));

        // active users find
        await Active.active.active_control(active);
        for(let [key,value] of active){
            actives.push(key);            
        }
        await AdminData.findOneAndUpdate(
          {
            $and: [
              { role: { $in: ["admin"] } },
              { active: { $nin: [kuserData.id] } },
            ],
          },
          {
            $push: {
              active: actives,
            },
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
                    store_open_hour: {//6
                      $lte: query.hour ? parseInt(query.hour) : 25,
                    },
                  },
                  {
                    store_close_hour: {//24
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
                $or: [
                  {
                    $elemMatch: { "view.who": { $nin: kuserData.id } },
                  },
                  {
                    $elemMatch: { "view.who": { $in: kuserData.id } },
                    "view.date": { //11
                      $gte: new Date(+new Date() - 1 * 24 * 60 * 60 * 1000),//12
                    },
                  },
                ],
              },
            },
            {
              $project: {
                video: 0,
              },
            },
          ]);
          let currency = await doviz();

          return res.send({
            status: 200,
            message: "Products and StoreStory are success ",
            data: { product_data, admin_ads_story, currency },
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
                    store_open_hour: {//6
                      $lte: query.hour ? parseInt(query.hour) : 25,
                    },
                  },
                  {
                    store_close_hour: {//24
                      $gte: query.hour ? parseInt(query.hour) : 0,
                    },
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
                $or: [
                  // { view: { $elemMatch: { who: { $nin: [kuserData.id] } } } },
                  {
                    view: {
                      $elemMatch: {
                        // who: { $in: [kuserData.id] },
                        date: {//13
                          $gte: new Date(+new Date() - 1* 24 * 3600 * 10000),//12
                        },
                      },
                    },
                  },
                ],
              },
            },
            {
              $project: {
                video: 0,
              },
            },
          ]);
          let currency = await doviz();

          return res.send({
            status: 200,
            message: "Products and StoreStory are success ",
            data: { product_data, admin_ads_story, currency },
          });
        }
    } catch (error) {
      if (error.name === "MongoError" && error.code === 11000) {
        return next(new ApiError(error?.message, 422));
      }
      if (error.code === 27) {
        return next(new ApiError("We Don't Have Any Geonear Data", 204, null));
      }
      return next(new ApiError(error?.message));
    }
};

module.exports = route;