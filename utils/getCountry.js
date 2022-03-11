const Country = require('country-state-city').Country;
const City = require('country-state-city').City;
const State = require('country-state-city').State;

// [1:57 PM, 3/9/2022] +90 545 925 64 22: /store/countries (önce buraya get isteği gönderip ülkeleri aıyoruz)
// [1:57 PM, 3/9/2022] +90 545 925 64 22: /store/countries/${selected?.country} (ülke ismini gönderip şehirleri get ediyoruz)
// [1:58 PM, 3/9/2022] +90 545 925 64 22: /store/countries/${selected?.country}/districts/${selected?.city}

const country = async (req, res) => {
    let { countryCode }= req.query;

    if(!countryCode){
        let data = await Country.getAllCountries();
        return res.send({ status: 200, message: "Country Success", data })
    }else if(countryCode){
        let data = await Country.getCountryByCode(countryCode);
        return res.send({ status: 200, message: "Country Success", data })
    }
};
const city = async (req, res) => {
    console.log(req.params)
    let { cityCode } = req.query;
    let { country, city } = req.params;
    if(country && city){   
        console.log('girdi')
        let data = await City.getAllCities();
        return res.send({ status: 200, message: "Country Success", data })
    }else if(cityCode){
        let data = await City.getCitiesOfCountry(cityCode)
        return res.send({ status: 200, message: "Country Success", data })
    }
};
const state = async (req, res) => {
    let { countryCode , stateCode } = req.query;
    let data = await State.getStateByCodeAndCountry(stateCode,countryCode)
    return res.send({ status: 200, message: "State Success", data })
}

module.exports = { country, city, state }