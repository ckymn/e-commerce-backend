const Country = require("country-state-city").Country;
const City = require("country-state-city").City;
const State = require("country-state-city").State;

const country = async (req, res) => {
  let { ccode, scode } = req.query;

  if (!ccode && !scode) {
    // ulkeler
    let data = Country.getAllCountries();
    return res.send({ status: 200, message: "Country Success", data });
  } else if (ccode && !scode) {
    // iller
    let data = City.getCitiesOfCountry(ccode);
    return res.send({ status: 200, message: "City Success", data });
  } else if (ccode && scode) {
    //ilceler
    let data = City.getCitiesOfState(ccode, scode);
    return res.send({ status: 200, message: "State sucess", data });
  }
};

const city = async (req, res) => {
  let { ccode, scode } = req.query;

  if (country && city) {
    let data = City.getAllCities();
    return res.send({ status: 200, message: "Country Success", data });
  } else if (cityCode) {
    let data = City.getCitiesOfCountry(cityCode);
    return res.send({ status: 200, message: "Country Success", data });
  }
};

module.exports = { country, city };
