const Store = require("../../../store/auth/model"),
  Product = require("../../../store/products/model"),
  Story = require("../../story/model"),
  User = require("../../../user/auth/model"),
  Admin = require("../../login/model"),
  Subscription = require("../../subscriptions/model"),
  StoreAdvertisement = require("../../../store/advertisement/model"),
  AppNotification = require("../../app_notifications/model"),
  AdvertisementNotificaiton = require("../../../store/advertisement/model"),
  StoreNotification = require("../../../store/auth/model"),
  ProductNotification = require("../../../store/products/model"),
  Payment = require("../../../store/payment/model");

const route = async (req, res, next) => {
  try {
    let total_store = await Store.find({}).count().lean().exec();
    let total_product = await Product.find({}).count().lean().exec();
    let total_story = await Story.find({}).count().lean().exec();
    let total_user = await User.find({}).count().lean().exec();
    //active kullanici sayilarini bul
    let active_user = await Admin.find({ role: { $in: "admin" } })
      .select("active -_id")
      .lean()
      .exec();
    let total_sub_1month = await Subscription.find({
      sub_name: { $in: "1Month" },
    })
      .count()
      .lean()
      .exec();
    let total_sub_3month = await Subscription.find({
      sub_name: { $in: "3Month" },
    })
      .count()
      .lean()
      .exec();
    let total_sub_1year = await Subscription.find({
      sub_name: { $in: "1Year" },
    })
      .count()
      .lean()
      .exec();

    let storys = await Story.find({}).lean().exec();
    let admins = await Admin.find({}).lean().exec();
    let stores = await Store.find({}).lean().exec();
    let users = await User.find({}).lean().exec();
    let store_ads = await StoreAdvertisement.find({}).lean().exec();
    let app_ntfc = await AppNotification.find({}).lean().exec();
    let ads_ntfc = await AdvertisementNotificaiton.find({ is_approved: "wait" })
      .lean()
      .exec();
    let store_ntfc = await StoreNotification.find({ is_approved: "wait" })
      .lean()
      .exec();
    let product_ntfc = await ProductNotification.find({ is_approved: "wait" })
      .lean()
      .exec();
    let income_info = await Payment.find({}).lean().exec();

    return res.status(200).send({
      status: true,
      message: "Admin Home Page success",
      data: {
        total_store,
        total_product,
        total_story,
        total_user,
        active_user,
        total_sub_1month,
        total_sub_3month,
        total_sub_1year,
        storys,
        admins,
        stores,
        users,
        store_ads,
        app_ntfc,
        ads_ntfc,
        store_ntfc,
        product_ntfc,
        income_info
      },
    });
  } catch (error) {
    if (error) {
      if (error.name === "MongoError" && error.code === 11000)
        return res
          .status(500)
          .send({ status: false, message: `File Already exists!  : ${error}` });
    }
    return res.status(500).send({
      status: false,
      message: `Admin Panel Something Missing => ${error}`,
    });
  }
};

module.exports = route;
