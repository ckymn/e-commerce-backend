const Data = require("../model");
const Store = require("../../auth/model")
const storage = require("../../../../uploads/products")

const route = async (req, res, next) => {
    try {
        let { body, files , userData} = req;
        // FAZLA URUN : birden fazla urun girerse body nasil donecek bana ?
        let _data = await Store.findOne({ _id: userData.id }).lean();
        let _pr = await new Data({
            ...body,
            location: {
                coordinates: [ parseFloat(body.long),parseFloat(body.lat) ]
            },
            country: _data.storecountry,
            city: _data.storecity,
            district: _data.storedistrict,
            language: _data.storelanguage,
            author: userData.id,
        })
        if(!_pr)
            return res.status(400).send({ status: false, message: "Add Product doesn't work"})
        const imageUrl = await storage.Upload(files, userData.sub, _pr._id);
        let str = await Promise.all(imageUrl).then(d => d );
        await _pr.set({
            images: str.map(i => i)
        })
        await _pr.save();
        return res.status(200).send({ status: true, message: "Add Product worked"})
    } catch (error) {
        console.log(error)
        if(error){
            if(error.name === "MongoError" && error.code === 11000)
                return res.status(500).send({ status: false, message: `File Already exists!  : ${error}` })
        }
        return res.status(500).send({ status: false, message: `Store Add Products Error Cannot Upload Something Missing => ${error}`})
    }
}

module.exports = route