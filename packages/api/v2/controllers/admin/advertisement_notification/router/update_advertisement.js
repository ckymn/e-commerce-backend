const Data = require("../../../store/advertisement/model");
const ApiError = require("../../../../errors/ApiError");

const route = async (req, res, next) => {
  try {
    let { files, body, params } = req;
    let { is_approved } = body;
    let buyer_ip = "192.168.1.37";

    await Data.findOne({ _id: params.id })
      .lean()
      .exec(async (err, data) => {
        if (!data)
          return res.send({ status: 404, message: "Not Found any Data", data });

        if (data.is_approved === "wait") {
          if (is_approved === "no") {
            let data = await Data.findOneAndUpdate(
              { _id: params.id },
              { $set: { is_approved: "no" } }
            );
            if (!data)
              return next(
                new ApiError(
                  "Update store advertisement status not found",
                  404,
                  []
                )
              );
            return res.send({
              status: 200,
              message: "Magazanin Parasi Geri Odendi, Reklam askiya alindi",
              data,
            });
          }
          if (is_approved === "yes") {
            let data = await Data.findOneAndUpdate(
              { _id: params.id },
              {
                $set: {
                  is_approved: "yes",
                },
              }
            );
            if (!data)
              return next(
                new ApiError(
                  "Admin update advertisement notification didn't match",
                  404,
                  []
                )
              );
            return res.send({
              status: 200,
              message: "get single notification change success YES",
              data,
            });
          }
          if (is_approved === "wait") {
            return next(new ApiError("Already wait ", 400, []));
          }
        }
        if (data.is_approved === "no") {
          if (is_approved === "wait") {
            let data = await Data.findOneAndUpdate(
              { _id: params.id },
              { $set: { is_approved: "wait" } },
              { new: true }
            );
            if (!data)
              return next(
                new ApiError("Admin update advertisemnt didn't match", 404, [])
              );
            return res.send({
              status: 200,
              message: "get single notification change success WAIT",
              data,
            });
          }
          if (is_approved === "yes") {
            let data = await Data.findOneAndUpdate(
              { _id: params.id },
              { $set: { is_approved: "yes" } }
            );
            if (data.matchedCount === 0)
              return next(
                new ApiError("Admin update advertisement didn't match", 404, [])
              );
            return res.send({
              status: 200,
              message: "get single notification change success YES",
              data,
            });
          }
          if (is_approved === "no") {
            return next(new ApiError("Already no ", 400, []));
          }
        }
        if (data.is_approved === "yes") {
          if (is_approved === "no") {
            let data = await Data.findOneAndUpdate(
              { _id: params.id },
              { $set: { is_approved: "no" } }
            );
            if (!data)
              return next(
                new ApiError(
                  "Update store advertisement status not found",
                  404,
                  []
                )
              );
            return res.send({
              status: 200,
              message: "Magazanin Parasi Geri Odendi , hesabiniz askiya alindi",
              data,
            });
          }
          if (is_approved === "wait") {
            let data = await Data.findOneAndUpdate(
              { _id: params.id },
              { $set: { is_approved: "wait" } },
              { new: true }
            );
            if (!data)
              return next(
                new ApiError("Admin update advertisement didn't match", 404, [])
              );
            return res.send({
              status: 200,
              message: "get single notification change success WAIT",
              data,
            });
          }
          if (is_approved === "yes") {
            return next(new ApiError("Already yes ", 400, []));
          }
        }
      });
  } catch (error) {
    if (error.name === "MongoError" && error.code === 11000) {
      next(new ApiError(error?.message, 422));
    }
    if (error.code === 27) {
      next(new ApiError("We Don't Have Any Data", 204, []));
    }
    next(new ApiError(error?.message));
  }
};

module.exports = route;
