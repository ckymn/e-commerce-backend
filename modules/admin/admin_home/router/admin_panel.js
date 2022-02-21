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
  ProductNotification = require("../../../store/products/model");

const route = async (req, res, next) => {
  try {
    let total_store = await Store.find({})
      .count()
      .lean()
      .exec((_, data) => {
        if (!data) {
          return res.status(404).send({
            status: false,
            message:
              "Admin/admin_home/admin_panel ,Don't Match Total Store Data",
          });
        }
      });
    let total_product = await Product.find({})
      .count()
      .lean()
      .exec((_, data) => {
        if (!data) {
          return res.status(404).send({
            status: false,
            message:
              "Admin/admin_home/admin_panel ,Don't Match Total Product Data",
          });
        }
      });
    let total_story = await Story.find({})
      .count()
      .lean()
      .exec((_, data) => {
        if (!data) {
          return res.status(404).send({
            status: false,
            message:
              "Admin/admin_home/admin_panel ,Don't Match Total Stories Data",
          });
        }
      });
    let total_user = await User.find({})
      .count()
      .lean()
      .exec((_, data) => {
        if (!data) {
          return res.status(404).send({
            status: false,
            message:
              "Admin/admin_home/admin_panel ,Don't Match Total Users Data",
          });
        }
      });
    //active kullanici sayilarini bul
    let active_user = await Admin.find({ role: { $in: "admin" } })
      .select("active -_id")
      .lean()
      .exec((_, data) => {
        if (!data) {
          return res.status(404).send({
            status: false,
            message:
              "Admin/admin_home/admin_panel ,Don't Match Active User Data",
          });
        }
      });
    let total_sub_1month = await Subscription.find({
      sub_name: { $in: "1Month" },
    })
      .count()
      .lean()
      .exec((_, data) => {
        if (!data) {
          return res.status(404).send({
            status: false,
            message:
              "Admin/admin_home/admin_panel ,Don't Match 1 Month Subscription Data",
          });
        }
      });
    let total_sub_3month = await Subscription.find({
      sub_name: { $in: "3Month" },
    })
      .count()
      .lean()
      .exec((_, data) => {
        if (!data) {
          return res.status(404).send({
            status: false,
            message:
              "Admin/admin_home/admin_panel ,Don't Match 3 Month Subscription Data",
          });
        }
      });
    let total_sub_1year = await Subscription.find({
      sub_name: { $in: "1Year" },
    })
      .count()
      .lean()
      .exec((_, data) => {
        if (!data) {
          return res.status(404).send({
            status: false,
            message:
              "Admin/admin_home/admin_panel ,Don't Match 1 Year Subscription Data",
          });
        }
      });

    let storys = await Story.find({})
      .lean()
      .exec((_, data) => {
        if (!data) {
          return res.status(404).send({
            status: false,
            message: "Admin/admin_home/admin_panel ,Don't Match Stories Data",
          });
        }
      });
    let admins = await Admin.find({})
      .lean()
      .exec((_, data) => {
        if (!data) {
          return res.status(404).send({
            status: false,
            message: "Admin/admin_home/admin_panel ,Don't Match Admins Data",
          });
        }
      });
    let stores = await Store.find({})
      .lean()
      .exec((_, data) => {
        if (!data) {
          return res.status(404).send({
            status: false,
            message: "Admin/admin_home/admin_panel ,Don't Match Admins Data",
          });
        }
      });
    let users = await User.find({})
      .lean()
      .exec((_, data) => {
        if (!data) {
          return res.status(404).send({
            status: false,
            message: "Admin/admin_home/admin_panel ,Don't Match Users Data",
          });
        }
      });
    let store_ads = await StoreAdvertisement.find({})
      .lean()
      .exec((_, data) => {
        if (!data) {
          return res.status(404).send({
            status: false,
            message:
              "Admin/admin_home/admin_panel ,Don't Match Admin Advertisements Data",
          });
        }
      });
    let app_ntfc = await AppNotification.find({})
      .lean()
      .exec((_, data) => {
        if (!data) {
          return res.status(404).send({
            status: false,
            message:
              "Admin/admin_home/admin_panel ,Don't Match Admin App Notificaiton Data",
          });
        }
      });
    let ads_ntfc = await AdvertisementNotificaiton.find({ is_approved: "wait" })
      .lean()
      .exec((_, data) => {
        if (!data) {
          return res.status(404).send({
            status: false,
            message:
              "Admin/admin_home/admin_panel ,Don't Match Admin Advertisement Notification Data",
          });
        }
      });
    let store_ntfc = await StoreNotification.find({ is_approved: "wait" })
      .lean()
      .exec((_, data) => {
        if (!data) {
          return res.status(404).send({
            status: false,
            message:
              "Admin/admin_home/admin_panel ,Don't Match Admin Store Notification Data",
          });
        }
      });
    let product_ntfc = await ProductNotification.find({ is_approved: "wait" })
      .lean()
      .exec((_, data) => {
        if (!data) {
          return res.status(404).send({
            status: false,
            message:
              "Admin/admin_home/admin_panel ,Don't Match Admin Product Notification Data",
          });
        }
      });

    // burda amdin'in gelir bilgilerinin yer aldigi alan olmali ?!!
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
        product_ntfc
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
