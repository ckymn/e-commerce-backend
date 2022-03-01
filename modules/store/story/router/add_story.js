const Data = require("../model")
const Store = require("../../auth/model");
const storage = require("../../../../uploads/storeStorys");

const route = async (req, res, next) => {
    try {
        let { body, files , userData } = req;
        if (!files) {
            return res.status(400).send({  messages: 'No file uploaded'});
        }
        let author_img = await Store.findOne({ _id: userData.id }).lean();
        let _data = await new Data({
            ...body,
            author: userData.id,
            author_img: author_img.storeimg,
        }).save();
        if(!_data)
            return res.status(400).send({ status: false, message: "Not Found Add Store Story!"})
        if(files[0].mimetype.substr(0,5) === "video"){
            const str = await storage.vUpload(files,_data._id);
            await Data.updateOne({_id: _data._id},{
                $push: {
                    img: str.publicUrl
                }
            })
            return res.status(200).send({ status: true, message: "Add Store story worked", data: _data })
        }
        if(files[0].mimetype.substr(0,5) === "image"){
            const imagesUrl = await storage.Upload(files,_data._id);
            let str = await Promise.all(imagesUrl).then(d => d );
            console.log(str)
            await Data.updateOne({_id: _data._id},{
                $push: {
                    img: str
                }
            })
            return res.status(200).send({ status: true, message: "Add Store story worked", data: _data })
        }
        
    } catch (error) {
        console.log(error)
        if(error){
            if(error.name === "MongoError" && error.code === 11000)
                return res.status(500).send({ status: false, message: `files Already exists: ${error}`})
        }
        return res.status(500).send({ status: false, message: `Store Add Story ,Something Missing => ${error}`})
    }
}

module.exports = route

// let str = await Promise.all(imageUrl).then(d => d );
//         await _pr.set({
//           color: {
//             img: str.map(i => i),
//           },
//         });