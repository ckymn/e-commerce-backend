const currency = require("tr-doviz");

const doviz = async() => {
  return await currency();
};
module.exports = doviz;