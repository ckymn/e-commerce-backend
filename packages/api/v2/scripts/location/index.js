const location = require("./a");

const Location = async (req, res) => {
  let { ccode , scode} = req.query;

  if(!ccode && !scode){
    let data = location.data.map((i) => i.il_adi);
    return res.send({ status: 200, message: "Sehirler success", data});
  }
  if (ccode) {
    let data = location.data.filter((i) => i.il_adi === ccode);
    data = data[0].ilceler;
    return res.send({ status: 200, message: "Ilceler Success",data });
  }
};

module.exports = { Location };