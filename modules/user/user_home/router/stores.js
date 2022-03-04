const Data = require("../../auth/model");
const StoreBanner = require("../../../store/advertisement/model")
const StoreStory = require("../../../store/story/model")
const AdminAdsStory = require("../../../admin/advertisement/model")
const Stores = require("../../../store/auth/model");
const { ObjectId } = require("mongodb");

const route = async (req, res, next) => {
    try {
      let { kuserData, query } = req;
      let current_time = new Date();
      let _data = await Data.findOne({ _id: kuserData.id });

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
          $match:{
            $and:[
              { is_approved: "yes" },
              { banner_story_time: { $gte: current_time } },
              { ads_which: "Banner"  }
            ]
          }
        }
      ])
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
              : 6.25 * 1609.34,
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
              : 6.25 * 1609.34,
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
                store_open_hour: {
                  $lte: query.hour ? parseInt(query.hour) : 25,
                },
              },
              {
                store_close_hour: {
                  $gte: query.hour ? parseInt(query.hour) : 0,
                },
              },
            ],
          },
        },
        {
          $project: {
            _id: 0,
            data: "$$ROOT",
            is_follow:{ $in:[ObjectId(kuserData.id),"$follow"]},
          }
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
      if (error.code === 11000) {
        return res.status(422).send({
          status: false,
          message: `User Stores Page, Already Mongo Error`,
        });
      }
      if (error.code === 27) {
        return res.status(422).send({
          status: false,
          message: `We Don't Have Any Data`,
          data: null,
        });
      }
    }
}
module.exports = route