const Data = require("../model");
const User = require("../../../user/auth/model")
const { firebase_ntf } = require("../../../../utils");

const route = async (req, res, next) => {
    try {
      let { body } = req;
       
        let user = await User.find({
          $and:[
            { country: body.country},
            { city: body.city},
            { language: body.language}
          ],
          $expr: { $gt: [{ $strLenCP: "$registration_token" }, 40] },
        });
        // firebase registration token
        const registrationTokens = [];
        user.filter(i => { registrationTokens.push(i.registration_token) });
        const message = {
          data: {
            title: body.title,
            body: body.description,
          },
          tokens: registrationTokens,
        };
        let _message = await firebase_ntf(message, registrationTokens);
        console.log(_message);
        
        return;
        let _data = await new Data({ ...body });
      if (!_data) 
        return res.status(404).send({ status: false, message: "Add Application Notification Failed"});
        await _data.save();

      return res
        .status(200)
        .send({
          status: true,
          message: "Add Application Notification success",
          _data,
        });
    } catch (error) {
      if (error.name === "MongoError" && error.code === 11000) {
        return res.status(422).send({
          status: false,
          message: `File Already exists!  : ${error}`,
        });
      } else {
        return res.status(500).send({
          status: false,
          message: `Add Admin Notification Error , Something Missing => ${error}`,
        });
      }
    }
}

module.exports = route