const Data = require("../model")
const bcrypt  = require("bcryptjs")
const storage = require("../../../../uploads/stores")
 
const route = async (req, res, next) => {
    try {
        let { body , file  } = req;
        let { email, username, password } = body;
        let _result = await Data.findOne({ $or: [ { email }, { username }] });
        if(_result)
            return res.status(500).send({ status: false, message: "email already exists"})
        const hash = await bcrypt.hashSync(password, 10);
        const data = await new Data({
            ...body,
            location: {
                coordinates: [ parseFloat(body.long),parseFloat(body.lat) ]
            },
            store_open_hour: parseInt(body.store_open_hour),
            store_close_hour: parseInt(body.store_close_hour),
            password : hash,
        });
        // storage
        let str = await storage.Upload(file,data._id);
        if(str.status !== 200)
            return res.status(str.status).send({ status: false, message : str.message})
        await data.set({
          storeimg: str.publicUrl
        })
        await data.save();
        return res.status(200).send({ status: true, message: "user register success", data })
    } catch (error) {
      if (error.name === "MongoError" && error.code === 11000) {
        return res
          .status(422)
          .send({ status: false, message: `File Already exists!  : ${error}` });
      } else {
        return res
          .status(422)
          .send({
            status: false,
            message: `Store Register Error Cannot Upload Something Missing => ${error}`,
          });
      }
    }
    
}

module.exports = route;