
const express = require("express")
const router = express.Router();

//middleware
const {
  authJwt,
  active,
  uploadImage,
  idChecker,
  ip_mid,
  validate,
  errorHandler,
} = require("../middlewares");
//utils
const { country, city} = require("../utils/getCountry")
//validationss
const schemas = require("../validations/admin");

//admin_get
const admin_home = require("../modules/admin/admin_home/router")
const advertisement_notification = require("../modules/admin/advertisement_notification/router")
const income = require("../modules/admin/income/router")
const product_notificatios = require("../modules/admin/product_notifications/router")
const store_notifications = require("../modules/admin/store_notification/router")
const comment_notifications = require("../modules/admin/comment_notification/router")
const storePanel = require("../modules/admin/storePanel/router")
const userPanel = require("../modules/admin/usersPanel/router")
const app_notification = require("../modules/admin/app_notifications/router")

//admin_post
const sector = require("../modules/admin/sector/router");
const admin_advertisement  = require("../modules/admin/advertisement/router")
const login = require("../modules/admin/login/router")
const subscribe = require("../modules/admin/subscriptions/router")
const solutionPartner = require("../modules/admin/solution_partners/router");
const bad_words = require("../modules/admin/bad_words/router");

//admin_get
router.get(`/admin/homePage`, authJwt,admin_home.admin_panel);
router.get(`/admin/admin`, authJwt,admin_home.admin);
router.get(`/admin/sectors`, authJwt, sector.getSector)
router.get(`/admin/notification_advertisements`, authJwt ,advertisement_notification.all_advertisement_store);
router.get(`/admin/notification_advertisement/:id`,idChecker(), authJwt ,advertisement_notification.single_advertisement_store);
router.get(`/admin/products`, authJwt , product_notificatios.all_notification);
router.get(`/admin/product/:id`,idChecker(),authJwt,product_notificatios.get_single_notification)
router.get(`/admin/income`, authJwt ,income.income);
router.get(`/admin/stores`, authJwt, storePanel.all_store);
router.get(`/admin/store/:id`,idChecker(),authJwt, storePanel.single_store);
router.get(`/admin/users`, authJwt, userPanel.all_user);
router.get(`/admin/user/:id`,idChecker(),authJwt, userPanel.single_user);
router.get(`/admin/advertisements`,authJwt, admin_advertisement.all_advertisement);
router.get(`/admin/advertisement/:id`,idChecker(),authJwt, admin_advertisement.single_advertisement);
router.get(`/admin/admins`, authJwt, login.admin_all)
router.get(`/admin/notification_stores`, authJwt, store_notifications.all_store)
router.get(`/admin/store_comments`, authJwt, comment_notifications.all_store_comment)
router.get(`/admin/store_comment/:id`,idChecker(), authJwt, comment_notifications.single_store_comment)
router.get(`/admin/product_comments`, authJwt, comment_notifications.all_product_comment)
router.get(`/admin/product_comment/:id`,idChecker(), authJwt, comment_notifications.single_product_comment)
router.get(`/admin/all_subscribe`, authJwt, subscribe.all_subscription)
router.get(`/admin/partners`, authJwt,solutionPartner.all_partner)
router.get(`/admin/partner/:id`, authJwt,solutionPartner.single_partner)
router.get(`/admin/app_notifications`, authJwt,app_notification.all_notification)
router.get(`/admin/app_notification/:id`,idChecker(), authJwt,app_notification.single_notification)
router.get(`/admin/logout`, authJwt,login.logout)
router.get(`/admin/search_store`, authJwt ,storePanel.search_store); 
router.get(`/admin/bad_words`, authJwt, bad_words.all_bad_words)

router.get(`/countries`, country)// tum ulkeler ve tekil ulke

//admin_post
router.post(`/admin/register`,login.register)
router.post(`/admin/login`,login.login)
router.post(`/admin/forgot_password`,authJwt,login.forgot_password)
router.post(`/admin/reset_password`,authJwt,login.reset_password)
router.put(`/admin/update_password`,authJwt,login.update_password)
router.post(`/admin/register_admin`, authJwt,login.admin_ekle)
router.delete(`/admin/delete_admin/:id`,idChecker(), authJwt,login.admin_delete)
router.put(`/admin/update_admin/:id`,idChecker(), authJwt,login.admin_update)
router.post(`/admin/sector`, authJwt, sector.createSector);
router.put(`/admin/product_permission/:id`,idChecker(),authJwt,product_notificatios.update_product_permission)
router.put(`/admin/notification_store/:id`,idChecker(),authJwt, store_notifications.update_store)
router.put(`/admin/notification_advertisement/:id`,idChecker(), authJwt,advertisement_notification.update_advertisement_store);
router.post(`/admin/advertisement`,authJwt,admin_advertisement.advertisement)
router.delete(`/admin/advertisement/:id`,idChecker(),authJwt,admin_advertisement.delete_advertisement);
router.delete(`/admin/store/:id`,idChecker(), authJwt ,storePanel.delete_store);
router.put(`/admin/store/:id`,idChecker(), authJwt ,storePanel.update_store);
router.delete(`/admin/store_comment/:id`,idChecker(), authJwt, comment_notifications.delete_store_comments);
router.delete(`/admin/product_comment/:id`,idChecker(), authJwt, comment_notifications.delete_product_comments);
router.post(`/admin/subscribe`, authJwt,subscribe.add_subscription);
router.delete(`/admin/subscribe/:id`,idChecker(), authJwt, subscribe.delete_subscription);
router.put(`/admin/update_subscribe/:id`,idChecker(), authJwt,subscribe.update_subscription);
router.post(`/admin/partner`,authJwt, solutionPartner.add_partner)
router.delete(`/admin/partner/:id`,idChecker(),authJwt, solutionPartner.delete_partner)
router.put(`/admin/partner/:id`,idChecker(),authJwt, solutionPartner.update_partner)
router.post(`/admin/app_notification`,authJwt, app_notification.add_notification)
router.post(`/admin/guide`, authJwt, userPanel.guide)
router.post(`/admin/bad_words`, authJwt, bad_words.add_bad_words)


module.exports = router;    
