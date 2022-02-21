const express = require("express")
const router = express.Router();

//image upload
const { uploadImage } = require("./utils")

//middleware
const middleware = require("./middlewares");

//admin_get
const admin_home = require("./modules/admin/admin_home/router")
const advertisement_notification = require("./modules/admin/advertisement_notification/router")
const income = require("./modules/admin/income/router")
const product_notifications = require("./modules/admin/product_notifications/router")
const store_notifications = require("./modules/admin/store_notification/router")
const comment_notifications = require("./modules/admin/comment_notification/router")
const storePanel = require("./modules/admin/storePanel/router")
const userPanel = require("./modules/admin/usersPanel/router")
const app_notification = require("./modules/admin/app_notifications/router")

//admin_post
const sector = require("./modules/admin/sector/router");
const admin_advertisement  = require("./modules/admin/advertisement/router")
const login = require("./modules/admin/login/router")
const resetPassword = require("./modules/admin/resetPassword/router")
const updatePasword = require("./modules/admin/updatePassword/router")
const subscribe = require("./modules/admin/subscriptions/router")
const adminBanner = require("./modules/admin/banner/router")
const adminStory = require("./modules/admin/story/router")
const solutionPartner = require("./modules/admin/solution_partners/router")
//store_get
const store_home = require("./modules/store/store_home/router")
const sectorSearch = require("./modules/store/auth/router")
const products = require("./modules/store/products/router")
const all_advertisement = require('./modules/store/advertisement/router')
const store_images = require("./modules/store/img/router")
const panel = require("./modules/store/panel/router")

//store_post
const store_advertisement = require("./modules/store/advertisement/router")
const store_auth = require("./modules/store/auth/router")
const store_forgotPassword = require("./modules/store/password/router")
const store_resetPassword = require("./modules/store/password/router")
const store_updatePassword = require("./modules/store/password/router")
const storeStory = require("./modules/store/story/router")
const store_payment = require("./modules/store/payment/router")

//user_get
const user_auth = require("./modules/user/auth/router")
const user_comment = require("./modules/user/comment/router")
const user_profile = require("./modules/user/profile/router")
const user_home = require("./modules/user/user_home/router");
const user_follow = require("./modules/user/follow/rotuer")
const user_star = require("./modules/user/star/router")
const user_favorite = require("./modules/user/favorite/router")
//
//
//
//

//admin_get
router.get(`/admin/homePage`, middleware.authJwt,admin_home.admin_panel);
router.get(`/admin/admin`, middleware.authJwt,admin_home.admin);
router.get(`/admin/sectors`, middleware.authJwt, sector.getSector)
router.get(`/admin/notification_advertisements`, middleware.authJwt ,advertisement_notification.all_advertisement_store);
router.get(`/admin/notification_advertisement/:id`, middleware.authJwt ,advertisement_notification.single_advertisement_store);
router.get(`/admin/products`, middleware.authJwt , product_notifications.all_notification);
router.get(`/admin/product/:id`,middleware.authJwt,product_notifications.get_single_notification)
router.get(`/admin/income`, middleware.authJwt ,income.income);
router.get(`/admin/stores`, middleware.authJwt, storePanel.all_store);
router.get(`/admin/store/:id`,middleware.authJwt, storePanel.single_store);
router.get(`/admin/users`, middleware.authJwt, userPanel.all_user);
router.get(`/admin/user/:id`,middleware.authJwt, userPanel.single_user);
router.get(`/admin/advertisements`,middleware.authJwt, admin_advertisement.all_advertisement);
router.get(`/admin/advertisement/:id`,middleware.authJwt, admin_advertisement.single_advertisement);
router.get(`/admin/admins`, middleware.authJwt, login.admin_all)
router.get(`/admin/notification_stores`, middleware.authJwt, store_notifications.all_store)
router.get(`/admin/suspension_store`, middleware.authJwt ,storePanel.suspension_store);
router.get(`/admin/store_comments`, middleware.authJwt, comment_notifications.all_store_comment)
router.get(`/admin/store_comment/:id`, middleware.authJwt, comment_notifications.single_store_comment)
router.get(`/admin/product_comments`, middleware.authJwt, comment_notifications.all_product_comment)
router.get(`/admin/product_comment/:id`, middleware.authJwt, comment_notifications.single_product_comment)
router.get(`/admin/all_subscribe`, middleware.authJwt, subscribe.all_subscription)
router.get(`/admin/banners`, middleware.authJwt,adminBanner.all_banner)
router.get(`/admin/stories`, middleware.authJwt,adminStory.all_story)
router.get(`/admin/partners`, middleware.authJwt,solutionPartner.all_partner)
router.get(`/admin/app_notifications`, middleware.authJwt,app_notification.all_notification)
router.get(`/admin/app_notification/:id`, middleware.authJwt,app_notification.single_notification)

//admin_post
router.post(`/admin/register`,uploadImage.single("img"),login.register)
router.post(`/admin/login`,login.login)
router.post(`/admin/register_admin`, middleware.authJwt,login.admin_ekle)
router.delete(`/admin/delete_admin/:id`, middleware.authJwt,login.admin_delete)
router.put(`/admin/update_admin/:id`, middleware.authJwt,login.admin_update)
router.post(`/admin/reset_password`,middleware.authJwt,resetPassword.resetPassword)
router.post(`/admin/update_password`,middleware.authJwt,updatePasword.updatePassword)
router.post(`/admin/sector`, middleware.authJwt, sector.createSector);
router.post(`/admin/notification_product/:id`,middleware.authJwt,product_notifications.post_single_notification)
router.put(`/admin/notification_store/:id`,middleware.authJwt, store_notifications.update_store)
router.put(`/admin/notification_advertisement/:id`, middleware.authJwt, uploadImage.single("img"),advertisement_notification.update_advertisement_store);
router.post(`/admin/advertisement`,middleware.authJwt, uploadImage.single("img"),admin_advertisement.advertisement)
router.delete(`/admin/advertisement/:id`,middleware.authJwt,admin_advertisement.delete_advertisement);
router.post(`/admin/search_store`, middleware.authJwt ,storePanel.search_store);
router.delete(`/admin/store/:id`, middleware.authJwt ,storePanel.delete_store);
router.put(`/admin/store/:id`, middleware.authJwt ,storePanel.update_store);
router.put(`/admin/store_comment/:id`, middleware.authJwt, comment_notifications.update_store_comments);
router.put(`/admin/product_comment/:id`, middleware.authJwt, comment_notifications.update_product_comments);
router.post(`/admin/subscribe`, middleware.authJwt, uploadImage.single("img"),subscribe.add_subscription);
router.delete(`/admin/subscribe/:id`, middleware.authJwt, subscribe.delete_subscription);
router.put(`/admin/update_subscribe/:id`, middleware.authJwt, uploadImage.single("img"),subscribe.update_subscription);
router.post(`/admin/banner`, middleware.authJwt, uploadImage.single("img"),adminBanner.add_banner)
router.delete(`/admin/banner/:id`, middleware.authJwt,adminBanner.delete_banner)
router.put(`/admin/banner/:id`, middleware.authJwt, uploadImage.single("img"),adminBanner.update_banner)
router.post(`/admin/storie`, middleware.authJwt, uploadImage.single("img"),adminStory.add_story)
router.delete(`/admin/storie/:id`, middleware.authJwt,adminStory.delete_story)
router.post(`/admin/partner`,middleware.authJwt, solutionPartner.add_partner)
router.delete(`/admin/partner/:id`,middleware.authJwt, solutionPartner.delete_partner)
router.put(`/admin/partner/:id`,middleware.authJwt, solutionPartner.update_partner)
router.post(`/admin/app_notification`,middleware.authJwt, app_notification.add_notification)
router.put(`/admin/app_notification/:id`,middleware.authJwt, app_notification.update_notificaiton)
router.delete(`/admin/app_notification/:id`,middleware.authJwt, app_notification.delete_notification)
router.post(`/admin/how_i_use`, middleware.authJwt, userPanel.how_i_use)
//store_get
router.get(`/store/store`, middleware.authJwt, store_home.store)
router.get(`/store/register`, store_auth.get_register)
router.get(`/store/login`, store_auth.get_login)
router.get(`/store/sectors`,middleware.authJwt, sectorSearch.get_sectors)
router.get(`/store/search_sector`,middleware.authJwt, sectorSearch.get_search_sector)
router.get(`/store/click_sector`,middleware.authJwt, sectorSearch.get_click_sector)
router.get(`/store/logout`,middleware.authJwt,store_auth.logout)
router.get(`/store/products`,middleware.authJwt,products.all_products)
router.get(`/store/product/:id`,middleware.authJwt,products.single_product)
router.get(`/store/advertisements`, middleware.authJwt, all_advertisement.all_advertisement)
router.get(`/store/advertisement/:id`, middleware.authJwt, all_advertisement.single_advertisement)
router.get(`/store/images`,middleware.authJwt,store_images.get_images)
router.get(`/store/myPanel`,middleware.authJwt,panel.get_info)
router.get(`/store/seller/:id`,middleware.authJwt,panel.show_info)
router.get(`/store/payments`, middleware.authJwt,store_payment.all_payment)
router.get(`/store/payment/:id`, middleware.authJwt, store_payment.single_payment)
router.get(`/store/payment_cancel/:id`,middleware.authJwt,store_payment.cancel_payment)
router.get(`/store/stories`,middleware.authJwt ,storeStory.all_story)

//store_post
router.post(`/store/register`,uploadImage.single("img"),store_auth.register)
router.post(`/store/login`,store_auth.login)
router.post(`/store/advertisement`, middleware.authJwt ,store_advertisement.add_advertisement)
router.post(`/store/forgot_password`,store_forgotPassword.forgotPassword)
router.post(`/store/update_password`,store_updatePassword.updatePassword)
router.post(`/store/reset_password`,store_resetPassword.resetPassword)
router.post(`/store/add_products`, middleware.authJwt, uploadImage.array('img',10),products.add_products)
router.delete(`/store/product/:id`, middleware.authJwt, products.delete_product)
router.put(`/store/product/:id`, middleware.authJwt, uploadImage.array('img',10), products.update_product)
router.delete(`/store/advertisement/:id`, middleware.authJwt, all_advertisement.delete_advertisement);
router.put(`/store/myPanel`,middleware.authJwt,panel.update_info);
router.post(`/store/payment`,middleware.authJwt,store_payment.store_date_payment)
router.post(`/store/storie`,middleware.authJwt, uploadImage.single("img"),storeStory.add_story)
router.delete(`/store/storie/:id`,middleware.authJwt,storeStory.delete_story);
router.delete(`/store/images`,middleware.authJwt,store_images.delete_images)

// users_get
router.get(`/user/login`,user_auth.get_login)
router.get(`/user/register`,user_auth.get_register)
router.get(`/user/home_page`, middleware.authJwt, middleware.active.active,user_home.home_page)
router.get(`/user/user`, middleware.authJwt, user_home.store)
router.get(`/user/storie/:id`, middleware.authJwt, user_home.single_store_story)
router.get(`/user/product/:id`, middleware.authJwt, user_home.single_product)
router.get(`/user/comment_store`, middleware.authJwt, user_profile.comment_store)
router.get(`/user/comment_product`, middleware.authJwt, user_profile.comment_product)
router.post(`/user/feed_back`, middleware.authJwt, user_profile.feed_back)
router.get(`/user/help`, middleware.authJwt, user_profile.help)
router.get(`/user/logout`, middleware.authJwt, user_profile.logout)
router.get(`/user/my_account`, middleware.authJwt, user_profile.my_account)
router.get(`/user/favorites`, middleware.authJwt, user_favorite.all_favorite)
router.get(`/user/stores`, middleware.authJwt, user_home.stores)
router.get(`/user/store/:id`, middleware.authJwt, user_home.single_store)
router.get(`/user/how_i_use`, middleware.authJwt, userPanel.get_how_i_use);
 
// user_post
router.post(`/user/login`,user_auth.login)
router.post(`/user/register`,uploadImage.single("img"),user_auth.register)
router.post(`/user/store_comment/:id`, middleware.authJwt, user_comment.add_store_comment)
router.delete(`/user/store_comment/:id`, middleware.authJwt, user_comment.delete_store_comment)
router.put(`/user/store_comment/:id`, middleware.authJwt, user_comment.update_store_comment)
router.post(`/user/product_comment/:id`, middleware.authJwt, user_comment.add_product_comment)
router.delete(`/user/product_comment/:id`, middleware.authJwt, user_comment.delete_product_comment)
router.put(`/user/product_comment/:id`, middleware.authJwt, user_comment.update_product_comment)
router.post(`/user/store_follow/:id`, middleware.authJwt, user_follow.store_follow)
router.delete(`/user/store_unfollow/:id`, middleware.authJwt, user_follow.store_unfollow)
router.post(`/user/product_star/:id`, middleware.authJwt, user_star.add_product_star)
router.delete(`/user/product_star/:id`, middleware.authJwt, user_star.delete_product_star)
router.put(`/user/product_star/:id`, middleware.authJwt, user_star.update_product_star)
router.post(`/user/store_star/:id`, middleware.authJwt, user_star.add_store_star)
router.delete(`/user/store_star/:id`, middleware.authJwt, user_star.delete_store_star)
router.put(`/user/store_star/:id`, middleware.authJwt, user_star.update_store_star)
router.post(`/user/product_favorite/:id`, middleware.authJwt, user_favorite.add_favorite)
router.delete(`/user/product_favorite/:id`, middleware.authJwt, user_favorite.delete_favorite)

module.exports = router;    