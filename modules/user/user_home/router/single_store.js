const Store = require("../../../store/auth/model")
const Product = require("../../../store/products/model")
const turf = require("turf")

const route = async (req, res, next) => {
    try {
        let { kuserData ,params, query } = req; 
        let current_time = new Date();
        let _product = await Product.find({ author: params.id }).lean().exec();
        if(!_product)
            return res.status(404).send({ status: false, message: "Not Found products of Single Store"})
        let _store = await Store.findOneAndUpdate({ _id: params.id },{ $push: { view: { who: kuserData.id , date: current_time } }}).lean().exec();
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