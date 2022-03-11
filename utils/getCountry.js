const Country = require('country-state-city').Country;
const City = require('country-state-city').City;
const State = require('country-state-city').State;

// [1:57 PM, 3/9/2022] +90 545 925 64 22: /store/countries (önce buraya get isteği gönderip ülkeleri aıyoruz)
// [1:57 PM, 3/9/2022] +90 545 925 64 22: /store/countries/${selected?.country} (ülke ismini gönderip şehirleri get ediyoruz)
// [1:58 PM, 3/9/2022] +90 545 925 64 22: /store/countries/${selected?.country}/districts/${selected?.city}

const country = async (req, res) => {
    let { countryCode, cityCode, stateCode } = req.query;

    // let data = await Country.getAllCountries();
    let data = await Country.getCountryByCode(countryCode)
    let city = await City.getCitiesOfCountry(cityCode)
    let district = await State.getStatesOfCountry(stateCode)

    return res.status(200).send({ status: true, message: "Country Success", district })
};


const city = async (req, res) => {
    let { query } = req;
    let data = await Country.getCountry(query.country)
    // let data = await City.getAllCities()
    return res.status(200).send({ status: true, message: "City Success", data })
}


const state = async (req, res) => {
    let data = await State.getAllStates()
    return res.status(200).send({ status: true, message: "State Success", data })
}

module.exports = { country, city, state }