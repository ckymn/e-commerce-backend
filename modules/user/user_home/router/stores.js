const Data = require("../../auth/model");
const StoreBanner = require("../../../store/advertisement/model")
const StoreStory = require("../../../store/story/model")
const AdminAdsStory = require("../../../admin/advertisement/model")
const Stores = require("../../../store/auth/model");
const { ObjectId } = require("mongodb");
const ApiError = require("../../../../errors/ApiError");

const route = async (req, res, next) => {
    try {
      let { kuserData, query } = req;
      let current_time = new Date();

      let _data = await Data.findOne({ _id: kuserData.id });
      if(!_data)
        return next(new ApiError("User not found",404))

      let store_ads = await StoreBanner.aggregate([
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
      let store_story = await StoreStory.aggregate([
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
            language: _data.language,
          },
        },
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
              { banner_story_time: { $gte: current_time } },
              { ads_which: "Banner" },
            ],
          },
        },
      ]);
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
  

      return res.status(200).send({
        status: true,
        message: "Stores Success",
        data: {
          store_ads,
          store_story,
          admin_ads_story,
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