const Data = require("../model")
const bcrypt  = require("bcryptjs")

const route = async (req, res, next) => {
    try {
      let { body } = req;
      let { email, username, password } = body;
      let _data = await Data.findOne({ $or: [{ email }, { username }] });
      if (_data)
        return res
          .status(500)
          .send({
            status: false,
            message: "email and username already exists",
          });
      const hash = await bcrypt.hash(password, 10);
      let _user = await new Data({
        ...body,
        location: {
          coordinates: [parseFloat(body.long), parseFloat(body.lat)],
        },
        password: hash,
      });
      await _user.save();
      return res
        .status(200)
        .send({ status: true, message: "user register success" });
    } catch (error) {
      if (error.name === "MongoError" && error.code === 11000) {
        return res.status(422).send({
          status: false,
          message: `User/Home Page , Mongdo Already exists: ${error}`,
        });
      } else {
        if (error.code === 27)
          return res.status(422).send({
            status: false,
            message: `We Don't Have Any Data`,
            data: null,
          });
      }
    }

}

module.exports = route