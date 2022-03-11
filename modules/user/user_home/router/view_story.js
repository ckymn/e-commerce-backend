const Stories = require("../../../store/story/model")
const AdminStoryAds = require("../../../admin/advertisement/model");
const ApiError = require("../../../../errors/ApiError");

const route = async (req,res,next) => {
    try {
        let { params, kuserData,query } = req;
        if(!query.type){
            return next(new ApiError("query type is necessary", 400,null))
        }else{
            if(query.type === "admin_ads"){
                await AdminStoryAds.findOne({ $and: [ {_id: params.id}, { "view.who": { $in : [ kuserData.id ]}}] })
                .lean().exec(async(_,result) => {
                    if(!result){
                        let data = await AdminStoryAds.findOneAndUpdate({ _id: params.id }, {
                            $push: { 
                                view: {
                                    who: kuserData.id,
                                    date: new Date()
                                }
                            }
                        })
                        if(!data)
                            return next(new ApiError("Admin advertisement story Not found",404,data))
                        return res.status(200).send({ status: true, message: "Find Single Stories success and View story set ", data })
                    }else{
                        return res.status(200).send({ status: true, message: "You already saw story", result })
                    }
                })
            }
            if(query.type === "store_storie"){
                await Stories.findOne({ $and: [ {_id: params.id}, { "view.who": { $in : [ kuserData.id ]}}] })
                .lean().exec(async(err,data) => {
                    if(!data){
                        let data = await Stories.findOneAndUpdate({ _id: params.id }, {
                            $push: { 
                                view: {
                                    who: kuserData.id,
                                    date: new Date()
                                }
                            }
                        })
                        if(!data)
                            return next(new ApiError("Store story Not found",404))
                        return res.status(200).send({ status: true, message: "Find Single Stories success and View story set ", data })
                    }else{
                        return res.status(200).send({ status: true, message: "Find Single Stories success", data })
                    }
                })
            }
        }
    } catch (error) {
        if (error.name === "MongoError" && error.code === 11000) {
          next(new ApiError(error?.message, 422));
        }
        if (error.code === 27) {
          next(new ApiError("We Don't Have Any Data", 204,null));
        }
        next(new ApiError(error?.message));
    }
};

module.exports = route;