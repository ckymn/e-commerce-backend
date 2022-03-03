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

      let store_ads = await StoreBanner.find({
        $and: [
          { is_approved: "yes" },
          { country: _data.country },
          { city: _data.city },
          { language: _data.language },
          { ads_which: "Banner" },
          { banner_story_time: { $gte: current_time } },
        ],
      })
        .select("img link");
      let store_story = await StoreStory.find({
        $and: [
          { country: _data.country },
          { city: _data.city },
          { language: _data.language },
        ],
      })
        .select("author_img img");
      let admin_ads_story = await AdminAdsStory.find({
        $and: [
          {
            $or: [
              {
                $and: [
                  { language: _data.language },
                  { country: _data.country },
                  { city: _data.city },
                  { district: _data.district },
                ],
              },
              {
                $and: [
                  { language: _data.language },
                  { country: _data.country },
                  { city: _data.city },
                ],
              },
            ],
          },
          {
            banner_story_time: { $gte: current_time },
          },
        ],
      })
        .select("author_img img link")
        .lean();
      let stores = await Stores.aggregate([
        {
          $geoNear: {
            near: {
              type: "Point",
              coordinates: [parseInt(query.long), parseInt(query.lat)],
            },
            spherical: true,
            distanceMultiplier: 1 / 1609.34,
            distanceField: "StoreDst",
          },
        },
        {
          $match: {
            $and: [
              {
                storecountry: _data.country,
                storecity: _data.city,
                storelanguage: _data.language,
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