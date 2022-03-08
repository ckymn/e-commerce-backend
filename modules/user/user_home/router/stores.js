const Data = require("../../auth/model");
const StoreBanner = require("../../../store/advertisement/model")
const AdminAdsStory = require("../../../admin/advertisement/model")
const Stores = require("../../../store/auth/model");
const StoreAds = require("../../../store/advertisement/model")
const { ObjectId } = require("mongodb");
const ApiError = require("../../../../errors/ApiError");

const route = async (req, res, next) => {
    try {
      let { kuserData, query } = req;
      let current_time = new Date();

      // magaza banner
      let store_ads_banner = await StoreBanner.aggregate([
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
          $match: {
            $and: [
              { is_approved: "yes" },
              { banner_story_time: { $gte: current_time } },
              { ads_which: "Banner" },
            ],
          },
        },
      ]);
      // admin banner
      let admin_ads_banner = await AdminAdsStory.aggregate([
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
              { banner_story_time: { $gte: current_time } },
              { ads_which: "Banner" },
            ],
          },
        },
      ]);
      // magaza reklam story
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
      // magaza story
      let store_story = await Data.aggregate([
        { $match: { _id: ObjectId(kuserData.id) } },
        {
          $lookup: {
            from: "stores",
            let: { follow: "$follow" },
            pipeline: [
              { $match: { $expr: { $in: ["$_id", "$$follow"] } } },
              {
                $lookup: {
                  from: "store_stories",
                  let: { store_id: "$_id" },
                  pipeline: [
                    {
                      $match: {
                        $and: [
                          { $expr: { $eq: ["$author", "$$store_id"] } },
                          { story_time: { $gte: current_time } },
                        ],
                      },
                    },
                  ],
                  as: "follow_stories",
                },
              },
            ],
            as: "follow_stores",
          },
        },
        {
          $project:{
            _id: 1,
            follow_stories: "$follow_stores.follow_stories"
          }
        }
      ]);
      // magazalar
      let stores = await Stores.aggregate([
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
            distanceField: "StoreDst",
          },
        },
        // {
        //   $match: {
        //     $and: [
        //       {
        //         is_approved: "yes",
        //       },
        //       {
        //         store_open_hour: {
        //           $lte: query.hour ? parseInt(query.hour) : 25,
        //         },
        //       },
        //       {
        //         store_close_hour: {
        //           $gte: query.hour ? parseInt(query.hour) : 0,
        //         },
        //       },
        //     ],
        //   },
        // },
        {
          $lookup:{
            from:"product_stars",
            localField:"_id",
            foreignField:"store_id",
            as:"star_avarage"
          }
        },
        {
          $project: {
            _id: 1,
            phone:1,
            storeimg:1,
            storedistrict:1,
            storename:1,
            StoreDistance:"$StoreDst",
            follow_count: { $cond: { if: { $isArray: "$follow" }, then: { $size: "$follow" }, else: "NA"} },
            star_count: { $size: "$star_avarage.rate" },
            star_avg: { $avg: "$star_avarage.rate" }
          },
        },
        { $skip: parseInt(query.skip) },
        { $limit: parseInt(query.limit) },
      ]);
      //? eski
      // let store_story = await StoreStory.aggregate([
      //   {
      //     $geoNear: {
      //       near: {
      //         type: "Point",
      //         coordinates: [parseFloat(query.long), parseFloat(query.lat)],
      //       },
      //       spherical: true,
      //       maxDistance: query.dst
      //         ? parseFloat(query.dst) * 1609.34
      //         : 900 * 1609.34,
      //       distanceMultiplier: 1 / 1609.34,
      //       distanceField: "StoreStoryDst",
      //     },
      //   },
      //   {
      //     $match: {
      //       $and: [
      //         { language: _data.language },
      //         { story_time: { $gte: current_time } },
      //       ],
      //     },
      //   }, 
      // ]);
      
  
      return res.status(200).send({
        status: true,
        message: "Stores Success",
        data: {
          store_ads_banner,
          admin_ads_banner,
          store_ads_story,
          store_story,
          stores,
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
}
module.exports = route