const Joi = require("joi")
Joi.objectId = require("joi-objectid")(Joi);

const register = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  storename: Joi.string().required(),
});

const product = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  brand: Joi.string().required(),
  style: Joi.string(),
  categories:[{
    sector: Joi.objectId(),
    category_one: Joi.objectId(),
    category_two: Joi.objectId(),
    category_three: Joi.objectId(),
    category_four: Joi.objectId(),
    category_five: Joi.objectId(),
  }],
  variants:[{
    color: Joi.string(),
    images:[{
      kind: Joi.string(),
      url: Joi.string()
    }],
    sizes:[{
      size: Joi.string(),
      available: Joi.number(),
      sku: Joi.string(),
      currency: Joi.string().valid("₺","$"),
      price: Joi.number(),
      min_prie: Joi.number()
    }]
  }],
  coordinates:[{
    long: Joi.number().precision(8),
    lat: Joi.number().precision(8)
  }],
  language: Joi.string().valid("da","nl","en","fi","fr","de","it","nb","pt","ro","ru","es","sv","tr"),

});

module.exports = {
  product,
  register
}