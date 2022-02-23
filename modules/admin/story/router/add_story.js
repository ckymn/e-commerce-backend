const Data = require("../model")
const Admin = require("../../login/model");
const storage = require("../../../../uploads/adminStorys");

const route = async (req, res, next) => {
    try {
        let { body, file , adminData } = req;
        let author_img = await Admin.findOne({ _id: adminData.id });
        let _data = await new Data({
            ...body,
            author: adminData.id,
            author_img: author_img.img
        })
        if(!_data)
            return res.status(400).send({ status: false, message: "Not Found Add Admin Story!"})
        if(file.mimetype.substr(0,5) === "video"){
            const str = await storage.vUpload(file,adminData.sub, _data._id);
            if(str.status != 200)
                return res.status(str.status).send({ status: false, message: str.message})
            if(body.story_time === "1d"){
                await _data.set({
                    img: str.publicUrl,
                    story_time: new Date(+new Date()+ 1*24*60*60*1000)
                })
            }
            if(body.story_time === "5d"){
                await _data.set({
                    img: str.publicUrl,
                    story_time: new Date(+new Date()+5*24*60*60*1000)
                })
            }
            if(body.story_time === "1w"){
                await _data.set({
                    img: str.publicUrl,
                    story_time: new Date(+new Date()+7*24*60*60*1000)
                })
            }
            if(body.story_time === "2w"){
                await _data.set({
                    img: str.publicUrl,
                    story_time: new Date(+new Date()+2*7*24*60*60*1000)
                })
            }
            if(body.story_time === "1m"){
                await _data.set({
                    img: str.publicUrl,
                    story_time: new Date(+new Date()+4*7*24*60*60*1000)
                })
            }
            await _data.save()
            return res.status(200).send({ status: true, message: "Add Admin Story success", data: _data })
        } 
        if(file.mimetype.substr(0,5) === "image"){
            const str = await storage.upload(file, adminData.sub, _data._id);
            if(str.status != 200)
                return res.status(str.status).send({ status: false, message: str.message})
            if(body.story_time === "1d"){
                await _data.set({
                    img: str.publicUrl,
                    story_time: new Date(+new Date()+24*60*60*1000)
                })
            }
            if(body.story_time === "5d"){
                await _data.set({
                    img: str.publicUrl,
                    story_time: new Date(+new Date()+5*24*60*60*1000)
                })
            }
            if(body.story_time === "1w"){
                await _data.set({
                    img: str.publicUrl,
                    story_time: new Date(+new Date()+7*24*60*60*1000)
                })
            }
            if(body.story_time === "2w"){
                await _data.set({
                    img: str.publicUrl,
                    story_time: new Date(+new Date()+2*7*24*60*60*1000)
                })
            }
            if(body.story_time === "1m"){
                await _data.set({
                    img: str.publicUrl,
                    story_time: new Date(+new Date()+4*7*24*60*60*1000)
                })
            }
            await _data.save()
            return res.status(200).send({ status: true, message: "Add Admin Story success", data: _data })
        }
    } catch (error) {
        if(error){
            if(error.name === "MongoError" && error.code === 11000)
                return res.status(500).send({ status: false, message: `File Already exists: ${error}`})
        }
        return res.status(500).send({ status: false, message: `Add Admin Story ,Something Missing => ${error}`})
    }
}

module.exports = route