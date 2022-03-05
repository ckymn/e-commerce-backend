const Store = require("../../../store/auth/model")
const Product = require("../../../store/products/model")
const turf = require("turf")

const route = async (req, res, next) => {
    try {
        let { kuserData ,params, query } = req; 
        let current_time = new Date();
        let _data = await Store.findOne({ _id: params.id }).lean();
        let start_store = _data.created_at.getDate();

        if(current_time.getDate() - start_store === 0){
            await Store.findOneAndUpdate(
              { _id: params.id },
              {
                $inc: { "search_count.1": 1, "location_search_count.1": 1 },
              }
            );
        }
        if(current_time.getDate() - start_store === 1){
            await Store.findOneAndUpdate(
              { _id: params.id },
              {
                $inc: { "search_count.2": 1, "location_search_count.2": 1 },
              }
            );
        }
        if(current_time.getDate() - start_store === 2){
            await Store.findOneAndUpdate(
              { _id: params.id },
              {
                $inc: { "search_count.3": 1, "location_search_count.3": 1 },
              }
            );
        }
        if(current_time.getDate() - start_store === 3){
            await Store.findOneAndUpdate(
              { _id: params.id },
              {
                $inc: { "search_count.4": 1, "location_search_count.4": 1 },
              }
            );
        }
        if(current_time.getDate() - start_store=== 4){
            await Store.findOneAndUpdate(
              { _id: params.id },
              {
                $inc: { "search_count.5": 1, "location_search_count.5": 1 },
              }
            );
        }
        if(current_time.getDate() - start_store=== 5){
            await Store.findOneAndUpdate(
              { _id: params.id },
              {
                $inc: { "search_count.6": 1, "location_search_count.6": 1 },
              }
            );
        }
        if(current_time.getDate() - start_store=== 6){
            await Store.findOneAndUpdate(
              { _id: params.id },
              {
                $inc: { "search_count.7": 1, "location_search_count.7": 1 },
              }
            );
        }
        if (current_time.getDate() - start_store === 7) {
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
        let _store = await Store.findOneAndUpdate(
          { _id: params.id },
          {
            $push: {
              view: { who: kuserData.id, date: current_time },
            },
          }
        );
        // magaza mesafesi 
        let s_lat = _store.location.coordinates[0]
        let s_long = _store.location.coordinates[1];
        let mesafe = turf.distance(
          turf.point([parseFloat(query.lat), parseFloat(query.long)]),
          turf.point([parseFloat(s_lat), parseFloat(s_long)]),
          "kilometers"
        );
        return res
          .status(200)
          .send({
            status: true,
            message: "Single Store and Products of Store find Success",
            data: { mesafe, _product },
          });
    }catch (error) {
      if (error.code === 11000) {
        return res
          .status(422)
          .send({
            status: false,
            message: `Single Store and Products of Store, Already Mongo Exist`,
          });
      } else {
        return res
          .status(422)
          .send({
            status: false,
            message: `User/Single Store , Missing Error : ${error}`,
          });
      }
    }
}
module.exports = route