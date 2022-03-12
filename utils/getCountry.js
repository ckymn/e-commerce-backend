const Country = require('country-state-city').Country;
const City = require('country-state-city').City;
const State = require('country-state-city').State;


const country = async (req, res) => {
  let { ccode , scode} = req.query;

  if (!ccode && !scode) {
      // ulkeler
    let data = await Country.getAllCountries();
    return res.send({ status: 200, message: "Country Success", data });
  } else if (ccode && !scode) {
      // iller
    let data = await City.getCitiesOfCountry(ccode);
    return res.send({ status: 200, message: "City Success", data });
  }else if(ccode && scode){
      //ilceler
    let data = await City.getCitiesOfState(ccode,scode);
    return res.send({ status: 200, message:"State sucess", data})
  }
};

const city = async (req, res) => {
    let { ccode,scode } = req.query;

    if(country && city){   
        let data = await City.getAllCities();
        return res.send({ status: 200, message: "Country Success", data })
    }else if(cityCode){
        let data = await City.getCitiesOfCountry(cityCode)
        return res.send({ status: 200, message: "Country Success", data })
    }
};

module.exports = { country, city }