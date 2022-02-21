const Data = require('../../../store/products/model')

const route = async (req, res) => {
  try {
    let { id } = req.params;
    let _data = await Data.findOne({ _id: id }).lean();
    if(_data) 
      return res.status(404).send({ status: false, message: "Single Product Notification doesn't found"})
    return res.status(200).send({ status: true, message: "Single Product Notification success", data: _data })
  } catch (error) {
    if(error){
      if(error.name === "MongoError" && error.code === 11000)
          return res.status(500).send({ status: false, message: `File Already exists!  : ${error}` })
    }
    return res.status(500).send({ 
      status: false, 
      message: `Single Product Notificaton Error Cannot Upload Something Missing => ${error}`
    })
  }
};

module.exports = route;