const { Sector } = require("../model")

const route = async (req,res,next) => {
    try {
        let data = await Sector.find({}).lean().exec();         
        return res.status(200).send({ status: true, message: "Admin Sector success" , data })
    } catch (error) {
      if (error.name === "MongoError" && error.code === 11000) {
        return res
          .status(422)
          .send({ status: false, message: "Database Already Exist" });
      } else {
        return res
          .status(422)
          .send({ status: false, message: `Admin GetSectors ${error}` });
      }
    }
    
};
module.exports = route
