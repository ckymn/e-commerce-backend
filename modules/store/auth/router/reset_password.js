const Data = require("../model");
const bcrypt = require("bcryptjs")

const route = async (req, res, next) => {
    try {
        let { body, adminData } = req;
        
        let _data = await Data.findOne({ _id: adminData.id }).lean().exec();
        if(!_data)
            return res.status(404).send({ status: false, message: "Before Code , Don't match any data"})
        if(body.code != _data.code){
            return res.status(400).send({ status: false , message: "Don't Match Code. Try Again"})
        }else{
            if(body.new_password != body.new_again_password){
                return res.status(400).send({ status: false , message: "New Passwords Don't Match. Try Again"})
            }else{
                let hash = await bcrypt.hash(body.new_password, 10);
                let u_pas_data = await Data.findOneAndUpdate({ _id: adminData.id }, {$set: { password: hash , code:"" }},{new: true})
                if(!u_pas_data)
                    return res.status(404).send({ status: false, message: "After code , Don't match any data"})
                return res.status(200).send({ status: true, message: "Reset Password Success"})
            }
        }
    } catch (error) {
        if(error){
            if(error.name === "MongoError" && error.code === 11000)
                return res.status(500).send({ status: false, message: `Forgot Password, Mongo Error => ${error}`})
        }
        return res.status(500).send({ status: false, message: `Forgot Password, Missing Somethimes => ${error}`})
    }
}

module.exports = route