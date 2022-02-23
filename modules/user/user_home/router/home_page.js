const Data = require("../../auth/model")
const Products = require("../../../store/products/model")
const Stories = require("../../../store/story/model")
const AdminData = require("../../../admin/login/model")
const ActiveUser = require("../../../../middlewares")
const AdminStory = require("../../../admin/story/model")

const route = async (req,res,next) => {
    try {
        let { kuserData ,params, query ,body } = req;
        let actives = [];
        let current_time = new Date();

        await ActiveUser.active.active_control(req.active);
        for(let [key,value] of req.active){
            actives.push(key);            
        }
        let a_user = await AdminData.findOneAndUpdate({ role: { $in: ["admin"] } },
            { 
                $set: {
                    active: actives
                }
            }
        );
        if(!a_user)
            return res.status(400).send({ status: false, message: "Active User Don't Find"})
        // search
        let _data = await Data.findOne({ _id: kuserData.id});
        let product_data = await Products.aggregate([
          {
            $geoNear: {
              near: {
                type: "Point",
                coordinates: [parseInt(query.long), parseInt(query.lat)],
              },
              spherical: true,
              maxDistance: query.dst ? parseInt(query.dst)* 1609.34 : 900 * 1609.34,
              distanceMultiplier: 1 / 1609.34,
              distanceField: "ProductDst",
            },
          },
          { $skip: parseInt(query.skip) },
          { $limit: parseInt(query.limit) },
          {
            $match: {
              $expr: {
                $and: [
                  {
                    country: _data.country,
                    city: _data.city,
                    language: _data.language,
                  },
                  {
                    $and: [
                      {
                        $gte: [
                          "$price",
                          query.minPrc ? parseInt(query.minPrc) : 0,
                        ],
                      },
                      {
                        $lte: [
                          "$price",
                          query.maxPrc ? parseInt(query.maxPrc) : 1000000,
                        ],
                      },
                    ],
                  },
                  // { $is_approved: "yes" },
                ],
              },
            },
          },
        ]);
        let store_story = await Stories.find({ 
            $and:[
                { language: _data.language },
                { country: _data.country },
                { city: _data.city },
            ]
        })//.where('_id').in(_data.follow);
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
        return res.status(200).send({ status: true, message: "Products and Stories are success ", 
            data: { product_data , store_story, admin_story }
        })
    } catch (error) {
        if(error){
            if(error.name === "MongoError" && error.code === 11000)
                return res.status(500).send({ status: false, message: `User/Home Page , Mongdo Already exists: ${error}`})
        }
        return res.status(500).send({ status: false, message: `User Home Page ,Something Missing => ${error}`})
    }
};

module.exports = route;