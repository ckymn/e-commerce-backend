const Data = require("../model")
const Admin = require("../../login/model");
const storage = require("../../../../uploads/adminStorys");

const route = async (req, res, next) => {
    try {
        let { body, files , adminData } = req;
        if(!files)
            return res.status(400).send({  messages: 'No file uploaded'});
        let author_img = await Admin.findOne({ _id: adminData.id }).lean();
        let _data = await new Data({
            ...body,
            author_img: author_img.img
        }).save();
        if(!_data)
            return res.status(400).send({ status: false, message: "Not Found Add Admin Story!"})
        if(files[0].mimetype.substr(0,5) === "video"){
            const str = await storage.vUpload(file,adminData.sub, _data._id);
            if(str.status != 200)
                return res.status(str.status).send({ status: false, message: str.message})
            if(body.time === "1d"){
                const str = await storage.vUpload(files,_data._id);
                await Data.updateOne({_id: _data._id},{
                    $push: {
                        img: str.publicUrl,
                    },
                    $set:{
                        story_time: new Date(+new Date()+24*60*60*1000)
                    }
                })
            }
            if(body.time === "5d"){
                const str = await storage.vUpload(files,_data._id);
                await Data.updateOne({_id: _data._id},{
                    $push: {
                        img: str.publicUrl,
                    },
                    $set:{
                        story_time: new Date(+new Date()+5*24*60*60*1000)
                    }
                })
            }
            if(body.time === "1w"){
                const str = await storage.vUpload(files,_data._id);
                await Data.updateOne({_id: _data._id},{
                    $push: {
                        img: str.publicUrl,
                    },
                    $set:{
                        story_time: new Date(+new Date()+7*24*60*60*1000)
                    }
                })
            }
            if(body.time === "2w"){
                const str = await storage.vUpload(files,_data._id);
                await Data.updateOne({_id: _data._id},{
                    $push: {
                        img: str.publicUrl,
                    },
                    $set:{
                        story_time: new Date(+new Date()+2*7*24*60*60*1000)
                    }
                })
            }
            if(body.time === "1m"){
                const str = await storage.vUpload(files,_data._id);
                await Data.updateOne({_id: _data._id},{
                    $push: {
                        img: str.publicUrl,
                    },
                    $set:{
                        story_time: new Date(+new Date()+4*7*24*60*60*1000)
                    }
                })
            }
            return res.status(200).send({ status: true, message: "Add Admin Story success", data: _data })
        } 
        if(files[0].mimetype.substr(0,5) === "image"){
            const imagesUrl = await storage.Upload(files,_data._id);
            let str = await Promise.all(imagesUrl).then(d => d );
            if(body.time === "1d"){
                await Data.updateOne({_id: _data._id},{
                    $push: {
                        img: str,
                    },
                    $set: {
                        story_time: new Date(+new Date()+24*60*60*1000)
                    }
                })
            }
            if(body.time === "5d"){
                await Data.updateOne({_id: _data._id},{
                    $push: {
                        img: str,
                    },
                    $set:{
                        story_time: new Date(+new Date()+5*24*60*60*1000)
                    }
                })
            }
            if(body.time === "1w"){
                await Data.updateOne({_id: _data._id},{
                    $push: {
                        img: str,
                    },
                    $set:{
                        story_time: new Date(+new Date()+7*24*60*60*1000)
                    }
                })
            }
            if(body.time === "2w"){
                await Data.updateOne({_id: _data._id},{
                    $push: {
                        img: str,
                    },
                    $set:{
                        story_time: new Date(+new Date()+2*7*24*60*60*1000)
                    }
                })
            }
            if(body.time === "1m"){
                await Data.updateOne({_id: _data._id},{
                    $push: {
                        img: str,
                    },
                    $set:{
                        story_time: new Date(+new Date()+4*7*24*60*60*1000)
                    }
                })
            }
            return res.status(200).send({ status: true, message: "Add Admin Story success", data: _data })
        }
    } catch (error) {
        console.log(error)
        if(error){
            if(error.name === "MongoError" && error.code === 11000)
                return res.status(500).send({ status: false, message: `File Already exists: ${error}`})
        }
        return res.status(500).send({ status: false, message: `Add Admin Story ,Something Missing => ${error}`})
    }
}

module.exports = route