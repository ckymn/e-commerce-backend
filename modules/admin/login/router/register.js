const Data = require("../model")
const bcrypt  = require("bcryptjs")
const ApiError = require("../../../../errors/ApiError");

const route = async (req, res, next) => {
    try {
        let { body } = req;
        let { email, username, password  } = body;
        console.log(body.img)
        let user = await Data.findOne({ $and: [ { email }, { username }] });
        if(user)
            return res.status(500).send({ status: false, message: "email or username already exists", user})
        let hash = await bcrypt.hash(password, 10);
        let data = await Data.create({
            ...req.body,
            password:hash,
            img: body.img ? body.img : "https://storage.googleapis.com/vitrin_images/WhatsApp%20Image%202022-03-05%20at%2018.37.57.jpeg"
        });
        return res.send({ status: 200, message: "admin register success",data})
    } catch (error) {
        if (error.name === "MongoError" && error.code === 11000) {
          next(new ApiError(error?.message, 422));
        }
        if (error.code === 27) {
          next(new ApiError("We Don't Have Any Data", 204, null));
        }
        next(new ApiError(error?.message, 500));
    }
}

module.exports = route