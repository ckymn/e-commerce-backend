const Data = require("../model");
const Store = require("../../auth/model")
const Sectors = require("../../../admin/sector/model")

const route = async (req, res, next) => {
    try {
        let { body , userData} = req;
        
        let _data = await Store.findOne({ _id: userData.id }).lean();
        let _pr = await new Data({
            ...body,
            location: {
                coordinates: [ parseFloat(body.long),parseFloat(body.lat) ]
            },
            categories:body.categories,
            variants: body.variants,
            futures: body.futures,
            country: _data.storecountry,
            city: _data.storecity, 
            district: _data.storedistrict,
            language: _data.storelanguage,
            author: userData.id,
        }).save();
        if(!_pr)
            return res.status(400).send({ status: false, message: "Add Product doesn't work"})
        return res.status(200).send({ status: true, message: "Add Product worked"})
    } catch (error) {
        if(error){
            if(error.name === "MongoError" && error.code === 11000)
                return res.status(422).send({ status: false, message: `File Already exists!  : ${error}` })
        }else{
            return res.status(422).send({ status: false, message: `Store Add Products Error Cannot Upload Something Missing => ${error}`})
        }
    }
}

module.exports = route