const Joi = require("joi")

const badWords = Joi.object({
  words: Joi.array().min(1).max(100).required().unique(),
});

module.exports = {
  badWords,
};