const Store = require("../../../store/auth/model")
const Product = require("../../../store/products/model")
const turf = require("turf")

const route = async (req, res, next) => {
    try {
        let { kuserData ,params, query } = req; 
        let current_time = new Date();
        let _data = await Store.findOne({ _id: params.id }).lean();
        let start_store = _data.created_at.getDate();
        
        if(start_store - current_time.getDate() === 0){
            await Store.findOneAndUpdate(
              { _id: params.id },
              {
                $inc: { "search_count.1": 1, "location_search_count.1": 1 },
              }
            );
        }
        if(start_store - current_time.getDate() === 1){
            await Store.findOneAndUpdate(
              { _id: params.id },
              {
                $inc: { "search_count.2": 1, "location_search_count.2": 1 },
              }
            );
        }
        if(start_store - current_time.getDate() === 2){
            await Store.findOneAndUpdate(
              { _id: params.id },
              {
                $inc: { "search_count.3": 1, "location_search_count.3": 1 },
              }
            );
        }
        if(start_store - current_time.getDate() === 3){
            await Store.findOneAndUpdate(
              { _id: params.id },
              {
                $inc: { "search_count.4": 1, "location_search_count.4": 1 },
              }
            );
        }
        if(start_store - current_time.getDate() === 4){
            await Store.findOneAndUpdate(
              { _id: params.id },
              {
                $inc: { "search_count.5": 1, "location_search_count.5": 1 },
              }
            );
        }
        if(start_store - current_time.getDate() === 5){
            await Store.findOneAndUpdate(
              { _id: params.id },
              {
                $inc: { "search_count.6": 1, "location_search_count.6": 1 },
              }
            );
        }
        if(start_store - current_time.getDate() === 6){
            await Store.findOneAndUpdate(
              { _id: params.id },
              {
                $inc: { "search_count.7": 1, "location_search_count.7": 1 },
              }
            );
        }
        if (start_store - current_time.getDate() === 7) {
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
                "location_search_count.7":0
              },
            }
          );
        }
        
        let _product = await Product.find({ author: params.id }).lean().exec();
        if(!_product)
            return res.status(404).send({ status: false, message: "Not Found products of Single Store"})
        let _store = await Store.findOneAndUpdate({ _id: params.id },
            { 
                $push: { 
                    view: { who: kuserData.id , date: current_time } 
                }
            }).lean().exec();
        let s_lat = _store.location.coordinates[0]
        let s_long = _store.location.coordinates[1];
        let mesafe = turf.distance(
          turf.point([parseInt(query.lat), parseInt(query.long)]),
          turf.point([parseInt(s_lat), parseInt(s_long)]), 
          "kilometers"
        );
        return res.status(200).send({ status: true, message: "Single Store and Products of Store find Success", data: { mesafe, _product} })
    }catch (error) {
        if(error){
            if(error.code === 11000)
                return res.status(500).send({ status: false, message:`Single Store and Products of Store, Already Mongo Exist`})
        }
        return res.status(500).send({ status: false, message: `User/Single Store , Missing Error : ${error}`});
    }
}
module.exports = route