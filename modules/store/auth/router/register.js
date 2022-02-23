const Data = require("../model")
const bcrypt  = require("bcryptjs")
const storage = require("../../../../uploads/stores")
 
const route = async (req, res, next) => {
    try {
        let { body , file  } = req;
        let { email, username, password } = body;
        const _result = await Data.findOne({ $or: [ { email }, { username }] });
        if(_result)
            return res.status(500).send({ status: false, message: "email already exists"})
        // storage
        let str = await storage.upload(file,username);
        if(str.status !== 200)
            return res.status(str.status).send({ status: false, message : str.message})
        const hash = await bcrypt.hashSync(password, 10);
        const _user = await new Data({
            ...body,
            location: {
                coordinates: [ parseFloat(body.long),parseFloat(body.lat) ]
            },
            password : hash,
            storeimg: str.publicUrl
        });
        await _user.save();
        return res.status(200).send({ status: true, message: "user register success", data: _user })
    } catch (error) {
        console.log(error)
        if(error){
            if(error.name === "MongoError" && error.code === 11000)
                return res.status(500).send({ status: false, message: `File Already exists!  : ${error}` })
        }
        return res.status(500).send({ status: false, message: `Store Register Error Cannot Upload Something Missing => ${error}`})
    }
    
}

module.exports = route;