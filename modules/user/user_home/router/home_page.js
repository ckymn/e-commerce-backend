const Data = require("../../auth/model")
const Products = require("../../../store/products/model")
const AdminData = require("../../../admin/login/model")
const ActiveUser = require("../../../../middlewares")
const AdminStory = require("../../../admin/story/model")
const StoreStory = require("../../../store/story/model")
const AdminAds = require("../../../admin/advertisement/model")
const StoreAds = require("../../../store/advertisement/model")
const AppNfc = require("../../../admin/app_notifications/model")
const { ObjectId } = require("mongodb")

const route = async (req,res,next) => {
    try {
        let { kuserData ,params, query ,body } = req;
        let actives = [];
        let current_time = new Date();

        let _data = await Data.findOne({ _id: kuserData.id});
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
                  coordinates: [parseInt(query.long), parseInt(query.lat)],
                },
                spherical: true,
                maxDistance: query.dst
                  ? parseInt(query.dst) * 1609.34
                  : 900 * 1609.34,
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
                    country: _data.country,
                    city: _data.city,
                    language: _data.language,
                    is_approved: "yes",
                  },
                  {
                    "variants.sizes": {
                      $elemMatch: {
                        price: {
                          $gte: query.minPrc ? parseInt(query.minPrc) : 0,
                          $lte: query.maxPrc ? parseInt(query.maxPrc) : 1000000,
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
                data: "$$ROOT",
                is_favorite:{ $in:[ObjectId(kuserData.id),"$favorite"]},
              }
            },
            { $skip: parseInt(query.skip) },
            { $limit: parseInt(query.limit) },
          ]);
          let store_story = await StoreStory.find({ 
              $and:[
                  { language: _data.language },
                  { country: _data.country },
                  { city: _data.city },
              ]
          }).lean();
          let admin_story = await AdminStory.find({
              $and: [
                  {
                      $or:[
                          { $and: [ { language: _data.language },{ country: _data.country }, { city: _data.city }, { district: _data.district } ] },
                          { $and: [ { language: _data.language },{ country: _data.country }, { city: _data.city } ] }
                      ]
                  },
                  {
                      user_time: { $gte : current_time }
                  },
                  {
                      language: _data.language
                  }
              ]
              
          }).lean();
          let admin_ads = await AdminAds.aggregate([
            {
              $match:{
                $and:[
                  { country: _data.country },
                  { city: _data.city },
                  { language: _data.language },
                  { is_approved: "yes" }
                ]
              }
            }
          ])
          let store_ads = await StoreAds.aggregate([
            {
              $match:{
                $and:[
                  { country: _data.country },
                  { city: _data.city },
                  { language: _data.language },
                  { is_approved: "yes" }
                ]
              }
            }
          ])
          let app_ntf = await AppNfc.find({
            $and: [
              { country: _data.country },
              { city: _data.city },
              { district: _data.district },
              { language: _data.language },
            ],
          }).lean();
          
          return res
          .status(200)
          .send({
            status: true,
            message: "Products and StoreStory are success ",
            data: { product_data, store_story, admin_story , admin_ads, store_ads , app_ntf },
          });
        }else{
          let product_data = await Products.aggregate([
            {
              $geoNear: {
                near: {
                  type: "Point",
                  coordinates: [parseInt(query.long), parseInt(query.lat)],
                },
                spherical: true,
                maxDistance: query.dst
                  ? parseInt(query.dst) * 1609.34
                  : 900 * 1609.34,
                distanceMultiplier: 1 / 1609.34,
                distanceField: "ProductDst",
              },
            },
            {
              $match: {
                $and: [
                  {
                    country: _data.country,
                    city: _data.city,
                    language: _data.language,
                    is_approved: "yes",
                  },
                  {
                    "variants.sizes": {
                      $elemMatch: {
                        price: {
                          $gte: query.minPrc ? parseInt(query.minPrc) : 0,
                          $lte: query.maxPrc ? parseInt(query.maxPrc) : 1000000,
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
                data: "$$ROOT",
                is_favorite:{ $in:[ObjectId(kuserData.id),"$favorite"]},
              }
            },
            { $skip: parseInt(query.skip) },
            { $limit: parseInt(query.limit) },
          ]);
          let store_story = await StoreStory.find({ 
            $and:[
                { language: _data.language },
                { country: _data.country },
                { city: _data.city },
            ]
          })
          let admin_story = await AdminStory.find({
              $and: [
                  {
                      $or:[
                          { $and: [ { language: _data.language },{ country: _data.country }, { city: _data.city }, { district: _data.district } ] },
                          { $and: [ { language: _data.language },{ country: _data.country }, { city: _data.city } ] }
                      ]
                  },
                  {
                      user_time: { $gte : current_time }
                  },
                  {
                      language: _data.language
                  }
              ]
              
          })
          let admin_ads = await AdminAds.aggregate([
            {
              $match:{
                $and:[
                  { country: _data.country },
                  { city: _data.city },
                  { language: _data.language },
                  { is_approved: "yes" }
                ]
              }
            }
          ])
          let store_ads = await StoreAds.aggregate([
            {
              $match:{
                $and:[
                  { country: _data.country },
                  { city: _data.city },
                  { language: _data.language },
                  { is_approved: "yes" }
                ]
              }
            }
          ])
          let app_ntf = await AppNfc.find({
            $and: [
              { country: _data.country },
              { city: _data.city },
              { district: _data.district },
              { language: _data.language },
            ],
          }).lean();

          return res
          .status(200)
          .send({
            status: true,
            message: "Products and StoreStory are success ",
            data: { product_data, store_story, admin_story , admin_ads, store_ads ,app_ntf},
          });
        }
    } catch (error) {
      console.log(error)
      if(error.name === "MongoError" && error.code === 11000)
            return res.status(422).send({ status: false, message: `User/Home Page , Mongdo Already exists: ${error}`})
        if(error.code === 27)
          return res.status(422).send({ status: false, message: `We Don't Have Any Data`, data:null})
    }
};

module.exports = route;