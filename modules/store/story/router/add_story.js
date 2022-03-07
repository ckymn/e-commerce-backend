const Data = require("../model")
const Store = require("../../auth/model");
const storage = require("../../../../uploads/storeStorys");
const ApiError = require("../../../../errors/ApiError")

const route = async (req, res, next) => {
    try {
        let { body, files , userData } = req;
        
        if (files.length === 0) {
            return next(new ApiError("No file uploaded"))
        }else{
            let author_img = await Store.findOne({ _id: userData.id }).lean();
            let _data = await new Data({
                ...body,
                author: userData.id,
                author_img: author_img.storeimg,
            }).save();
            if(!_data)
                return next(new ApiError("Create store story didn't work",400));
            //video
            // if(files[0].mimetype.substr(0,5) === "video"){
            //     const str = await storage.vUpload(files,_data._id);
            //     await Data.updateOne({_id: _data._id},{
            //         $push: {
            //             img: str.publicUrl
            //         }
            //     })
            //     return res.status(200).send({ status: true, message: "Add Store story worked", data: _data })
            // }
            //image
            if(files[0].mimetype.substr(0,5) === "image"){
                const imagesUrl = await storage.Upload(files,_data._id);
                let str = await Promise.all(imagesUrl).then(d => d );
                let u_story = await Data.updateOne({_id: _data._id},{
                    $push: {
                        img: str
                    }
                })
                if(u_story.matchedCount === 0)
                    return next(new ApiError("Create store story update didn't work",400));
                return res.status(200).send({ status: true, message: "Add Store story worked", data: _data })
            }
            
        }
    } catch (error) {
        if (error.name === "MongoError" && error.code === 11000) {
          next(new ApiError(error?.message, 422));
        }
        if (error.code === 27) {
          next(new ApiError("We Don't Have Any Data", 500, null));
        }
        next(new ApiError(error?.message));
    }
}

module.exports = route;