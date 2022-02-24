const Data = require("../model");
const { sendEmail } = require("../../../../utils");
const { v4: uuidv4 } = require('uuid');

const route = async (req, res, next) => {
    try {
        let { body, adminData } = req;
        let _code = uuidv4();
        let u_code_data = await Data.findOneAndUpdate({ _id: adminData.id },{$set: {code: _code}},{new: true})
        if(!u_code_data)
            return res.status(404).send({ status: false, message: "Before Code , Don't match any data"})
        let _email = await sendEmail(body.email,"Vitrin Update Password",_code);
        if(_email.status != 200){
            return res.status(_email.status).send({ status: false, message: _email.message.response })
        }
        return res.status(200).send({ status: true, message: "Reset Code Send Success"})
    } catch (error) {
        if(error){
            if(error.name === "MongoError" && error.code === 11000)
                return res.status(500).send({ status: false, message: `Forgot Password, Mongo Error => ${error}`})
        }
        return res.status(500).send({ status: false, message: `Forgot Password, Missing Somethimes => ${error}`})
    }
}

module.exports = route