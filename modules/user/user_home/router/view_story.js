const Stories = require("../../../store/story/model")
const StoreAds = require("../../../store/advertisement/model")
const AdminStoryAds = require("../../../admin/advertisement/model")

const route = async (req,res,next) => {
    try {
        let { params, kuserData,query } = req;
        if(!query.type){
            return res.status(404).send({ status: false, message: "Not Found Any Data"})
        }else{
            if(query.type === "admin_ads"){
                await AdminStoryAds.findOne({ $and: [ {_id: params.id}, { view: { $in : [ kuserData.id ]}}] })
                .lean().exec(async(err,data) => {
                    if(!data){
                        let data = await AdminStoryAds.findOneAndUpdate({ _id: params.id }, {
                            $push: { 
                                view: kuserData.id
                            }
                        })
                        if(!data)
                            return res.status(400).send({ status: false, message: "Not Found Single Admin Story !"})
                        return res.status(200).send({ status: true, message: "Find Single Stories success and View story set ", data })
                    }else{
                        return res.status(200).send({ status: true, message: "Find Single Stories success", data })
                    }
                })
            }
            if(query.type === "store_ads"){
                await StoreAds.find({ $and: [ {_id: params.id},{ view: { $in : [ kuserData.id ]}}] })
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
            }
            if(query.type === "store_storie"){
                await Stories.findOne({ $and: [ {_id: params.id}, { view: { $in : [ kuserData.id ]}}] })
                .lean().exec(async(err,data) => {
                    if(!data){
                        let data = await Stories.findOneAndUpdate({ _id: params.id }, {
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
            }
        }
    } catch (error) {
        if (error.name === "MongoError" && error.code === 11000) {
        return res
            .status(422)
            .send({ status: false, message: `File Already exists: ${error}` });
        } else {
        return res.status(500).send({
            status: false,
            message: `User Single Stories ,Something Missing => ${error}`,
        });
        }
    }
};

module.exports = route;