const Data = require("../model")
const storage = require("../../../../uploads/products")

const route = async (req, res, next) => {
    try {
        let { file , userData} = req;
        let data = await new Data({
            author: userData.id,
        });
        if(!data){
            return res.status(400).send({ status: false, message: "Upload Images Error"})
        }else{
            let str = await storage.Upload(file,userData.id,data._id);
            if(str.status !== 200)
                return res.status(str.status).send({ status: false, message : str.message})
            await data.set({
                url: str.publicUrl
            })
            await data.save();
            return res.status(200).send({ status: true, message: "Upload Images Success",data})
        }
    } catch (error) {
        console.log(error)
        if(error){
            if(error.name === "MongoError" && error.code === 11000)
                return res.status(500).send({ status: false, message: `File Already exists!  : ${error}` })
        }
        return res.status(500).send({ status: false, message: `Upload Images , Something Missing => ${error}`})
    }
}

module.exports = route;