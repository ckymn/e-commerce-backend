const 
  Store = require("../../../store/auth/model"),
  Product = require("../../../store/products/model"),
  AdminStoryAds = require("../../advertisement/model"),
  User = require("../../../user/auth/model"),
  Admin = require("../../login/model"),
  Subscription = require("../../subscriptions/model"),
  StoreAdvertisement = require("../../../store/advertisement/model"),
  AppNotification = require("../../app_notifications/model"),
  AdvertisementNotificaiton = require("../../../store/advertisement/model"),
  StoreNotification = require("../../../store/auth/model"),
  ProductNotification = require("../../../store/products/model"),
  Payment = require("../../../store/payment/model"),
  StoreStory = require("../../../store/story/model")
  ApiError = require("../../../../errors/ApiError");

const route = async (req, res, next) => {
  try {
    let total_store = await Store.find({}).count().lean().exec();
    let total_product = await Product.find({}).count().lean().exec();
    let total_story = await StoreStory.find({}).count().lean().exec();
    let total_user = await User.find({}).count().lean().exec();
    let active_user = await Admin.find({ role: { $in: "admin" } })
      .select("active -_id")
      .lean()
      .exec();
    let total_sub_1month = await Subscription.find({ sub_name: { $in: "1Month" }})
      .count()
      .lean()
      .exec();
    let total_sub_3month = await Subscription.find({ sub_name: { $in: "3Month" }})
      .count()
      .lean()
      .exec();
    let total_sub_1year = await Subscription.find({ sub_name: { $in: "1Year" }})
      .count()
      .lean()
      .exec();

    let storys = await AdminStoryAds.find({ads_which: "Story"}).lean().exec();
    let banners = await AdminStoryAds.find({ads_which: "Banner"}).lean().exec();
    let stores = await Store.find({}).select("-password").lean().exec();
    let users = await User.find({}).select("-password").lean().exec();
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

    return res,send({
      status: 200,
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
        banners,
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
    if (error.name === "MongoError" && error.code === 11000) {
      return next(new ApiError(error?.message, 422));
    }
    if (error.code === 27) {
      return next(new ApiError("We Don't Have Any Data", 204,[]));
    }
    return next(new ApiError(error?.message));
  }
};

module.exports = route;
