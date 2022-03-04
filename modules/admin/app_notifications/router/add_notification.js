const Data = require("../model");
const User = require("../../../user/auth/model")
const { firebase_ntf } = require("../../../../utils");

const route = async (req, res, next) => {
    try {
      let { body } = req;

      let _data = await new Data({
        ...body,
      });
      if (!_data) {
        return res
          .status(400)
          .send({
            status: false,
            message: "Add Application Notification Failed",
          });
      } else {
        let user = await User.find({
          $and: [
            { country: body.country, city: body.city, language: body.language },
          ],
        }).select("registration_token -_id");
        console.log("burasi array olucak", user);

        const message = {
          data: body,
          tokens: user.registrationTokens,
        };
        let _message = await firebase_ntf(message, registrationTokens);

        console.log(_message);
        return;
        await _data.save();
        return res
          .status(200)
          .send({
            status: true,
            message: "Add Application Notification success",
            _data,
          });
      }
    } catch (error) {
      if (error.name === "MongoError" && error.code === 11000) {
        return res.status(422).send({
          status: false,
          message: `File Already exists!  : ${error}`,
        });
      } else {
        return res.status(422).send({
          status: false,
          message: `Add Admin Notification Error , Something Missing => ${error}`,
        });
      }
    }
}

module.exports = route