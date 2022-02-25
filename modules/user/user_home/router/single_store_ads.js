const StoreAds = require("../../../store/advertisement/model")

const route = async (req,res,next) => {
    try {
        let { params, kuserData } = req;
        await StoreAds.find({ $and: [ {_id: params.id}, { view: { $in : [ kuserData.id ]}}] })
            .lean().exec(async(err,data) => {
                if(data.length === 0){
                    let data = await StoreAds.findOneAndUpdate({ _id: params.id }, {
                        $push: { 
                            view: kuserData.id
                        }
                    })
                    if(!data)
                        return res.status(400).send({ status: false, message: "Not Found Single Store Story !"})
                    return res.status(200).send({ status: true, message: "Find Single Stories success and View story set ", data })
                }else{
                    return res.status(200).send({ status: true, message: "Find Single Stories success", data })
                }
            })
    } catch (error) {
        if(error){
            if(error.name === "MongoError" && error.code === 11000)
                return res.status(500).send({ status: false, message: `File Already exists: ${error}`})
        }
        return res.status(500).send({ status: false, message: `User Single Stories ,Something Missing => ${error}`})
    }
};

module.exports = route;