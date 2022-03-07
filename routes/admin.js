
const express = require("express")
const router = express.Router();

//image upload
const { uploadImage } = require("../utils")

//middleware
const middleware = require("../middlewares");
//validations
const schemas = require("../validations/project");

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

//admin_get
router.get(`/admin/homePage`, middleware.authJwt,admin_home.admin_panel);
router.get(`/admin/admin`, middleware.authJwt,admin_home.admin);
router.get(`/admin/sectors`, middleware.authJwt, sector.getSector)
router.get(`/admin/notification_advertisements`, middleware.authJwt ,advertisement_notification.all_advertisement_store);
router.get(`/admin/notification_advertisement/:id`,middleware.idChecker(), middleware.authJwt ,advertisement_notification.single_advertisement_store);
router.get(`/admin/products`, middleware.authJwt , product_notificatios.all_notification);
router.get(`/admin/product/:id`,middleware.idChecker(),middleware.authJwt,product_notificatios.get_single_notification)
router.get(`/admin/income`, middleware.authJwt ,income.income);
router.get(`/admin/stores`, middleware.authJwt, storePanel.all_store);
router.get(`/admin/store/:id`,middleware.idChecker(),middleware.authJwt, storePanel.single_store);
router.get(`/admin/users`, middleware.authJwt, userPanel.all_user);
router.get(`/admin/user/:id`,middleware.idChecker(),middleware.authJwt, userPanel.single_user);
router.get(`/admin/advertisements`,middleware.authJwt, admin_advertisement.all_advertisement);
router.get(`/admin/advertisement/:id`,middleware.idChecker(),middleware.authJwt, admin_advertisement.single_advertisement);
router.get(`/admin/admins`, middleware.authJwt, login.admin_all)
router.get(`/admin/notification_stores`, middleware.authJwt, store_notifications.all_store)
router.get(`/admin/store_comments`, middleware.authJwt, comment_notifications.all_store_comment)
router.get(`/admin/store_comment/:id`,middleware.idChecker(), middleware.authJwt, comment_notifications.single_store_comment)
router.get(`/admin/product_comments`, middleware.authJwt, comment_notifications.all_product_comment)
router.get(`/admin/product_comment/:id`,middleware.idChecker(), middleware.authJwt, comment_notifications.single_product_comment)
router.get(`/admin/all_subscribe`, middleware.authJwt, subscribe.all_subscription)
router.get(`/admin/partners`, middleware.authJwt,solutionPartner.all_partner)
router.get(`/admin/app_notifications`, middleware.authJwt,app_notification.all_notification)
router.get(`/admin/app_notification/:id`,middleware.idChecker(), middleware.authJwt,app_notification.single_notification)
router.get(`/admin/logout`, middleware.authJwt,login.logout)

//admin_post
router.post(`/admin/register`,middleware.validate(schemas.createValidation),uploadImage.single("img"),login.register)
router.post(`/admin/login`,login.login)
router.post(`/admin/forgot_password`,middleware.authJwt,login.forgot_password)
router.post(`/admin/reset_password`,middleware.authJwt,login.reset_password)
router.put(`/admin/update_password`,middleware.authJwt,login.update_password)
router.post(`/admin/register_admin`, middleware.authJwt,login.admin_ekle)
router.delete(`/admin/delete_admin/:id`,middleware.idChecker(), middleware.authJwt,login.admin_delete)
router.put(`/admin/update_admin/:id`,middleware.idChecker(), middleware.authJwt,login.admin_update)
router.post(`/admin/sector`, middleware.authJwt, sector.createSector);
router.put(`/admin/product_permission/:id`,middleware.idChecker(),middleware.authJwt,product_notificatios.update_product_permission)
router.put(`/admin/notification_store/:id`,middleware.idChecker(),middleware.authJwt, store_notifications.update_store)
router.put(`/admin/notification_advertisement/:id`,middleware.idChecker(), middleware.authJwt, uploadImage.array("img",2),advertisement_notification.update_advertisement_store);
router.post(`/admin/advertisement`,middleware.authJwt, uploadImage.array("img"),admin_advertisement.advertisement)
router.delete(`/admin/advertisement/:id`,middleware.idChecker(),middleware.authJwt,admin_advertisement.delete_advertisement);
router.post(`/admin/search_store`, middleware.authJwt ,storePanel.search_store);
router.delete(`/admin/store/:id`,middleware.idChecker(), middleware.authJwt ,storePanel.delete_store);
router.delete(`/admin/store_comment/:id`,middleware.idChecker(), middleware.authJwt, comment_notifications.delete_store_comments);
router.delete(`/admin/product_comment/:id`,middleware.idChecker(), middleware.authJwt, comment_notifications.delete_product_comments);
router.post(`/admin/subscribe`, middleware.authJwt, uploadImage.array("img",5),subscribe.add_subscription);
router.delete(`/admin/subscribe/:id`,middleware.idChecker(), middleware.authJwt, subscribe.delete_subscription);
router.put(`/admin/update_subscribe/:id`,middleware.idChecker(), middleware.authJwt, uploadImage.single("img"),subscribe.update_subscription);
router.post(`/admin/partner`,middleware.authJwt, solutionPartner.add_partner)
router.delete(`/admin/partner/:id`,middleware.idChecker(),middleware.authJwt, solutionPartner.delete_partner)
router.put(`/admin/partner/:id`,middleware.idChecker(),middleware.authJwt, solutionPartner.update_partner)
router.post(`/admin/app_notification`,middleware.authJwt, app_notification.add_notification)
router.post(`/admin/how_i_use`, middleware.authJwt, userPanel.how_i_use)

module.exports = router;    
