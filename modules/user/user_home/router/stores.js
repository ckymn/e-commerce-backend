const Data = require("../../auth/model");
const StoreBanner = require("../../../store/advertisement/model")
const AdminBanner = require("../../../admin/advertisement/model")
const StoreStory = require("../../../store/story/model")
const AdminStory = require("../../../admin/story/model")
const Stores = require("../../../store/auth/model")

// banners
// storys
// stores
const route = async (req, res, next) => {
    try {
        let { kuserData, query } = req;
        let _data = await Data.findOne({ _id: kuserData.id })
        
        let hours = new Date().getHours();
        let minuets = new Date().getMinutes();

        let _admin_banner = await AdminBanner.find({
            $and: [
                { country: _data.country },
                { city: _data.city },
                { language: _data.language },
            ],
        }).select("img link video");
        let _store_banner = await StoreBanner.find({
            $and: [
                { is_approved: "yes" },
                { country: _data.country },
                { city: _data.city },
                { language: _data.language }
            ]
        }).select("img link");
        let _store_story = await StoreStory.find({
            $and: [
                { country: _data.country },
                { city: _data.city },
                { language: _data.language }
            ]
        }).select("author_img img");
        let _admin_story = await AdminStory.find({
            $and: [
                { country: _data.country },
                { city: _data.city },
                { language: _data.language }
            ]
        }).select("author_img img link");
        
        let _stores = await Stores.aggregate([
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
          { $skip: parseInt(query.skip) },
          { $limit: parseInt(query.limit) },
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
        ]);
        return res.status(200).send({
            status: true, message: "Stores Success", data: {
                _store_banner, _admin_banner, _store_story, _admin_story, _stores
            }
        })
    } catch (error) {
        console.log(error)
        if (error) {
            if (error.code === 11000)
                return res.status(500).send({ status: false, message: `User Stores Page, Already Mongo Error` })
        }
        return res.status(500).send({ status: false, message: `User/Stores , Missing Error : ${error}` });
    }
}
module.exports = route