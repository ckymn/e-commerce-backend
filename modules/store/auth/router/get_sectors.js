const { Sector } = require("../../../admin/sector/model");

const route = async (req,res) => {
    try {
        let data = await Sector.find({}).lean().exec(); 
        
        return res.send({ status: 200, message: " Sector data success" , data })
    } catch (error) {
      if (error.name === "MongoError" && error.code === 11000) {
        return res
          .status(422)
          .send({ status: false, message: "Database Already Exist" });
      } else {
        return res
          .status(422)
          .send({ status: false, message: `Store GetSectors ${error}` });
      }
    }
}

module.exports = route;