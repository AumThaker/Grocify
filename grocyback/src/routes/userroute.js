import { Router } from 'express'
import { changeAddress, changePassword, changePhone, changeUsername, checkLoginToken, fetchUserDetails, loginUser, logoutUser, register, registerOtpSent, registerUser, verifyEmail } from '../controllers/usercontrol.js';
import verifyToken from '../middlewares/token.js';
const router = Router();
router.route("/registerUser").post(registerUser)
router.route("/register").post(register)
router.route("/loginUser").post(loginUser)
router.route("/logoutUser").post(verifyToken,logoutUser)
router.route("/registerOtpCreate").post(registerOtpSent)
router.route("/checkLoginToken").post(checkLoginToken)
router.route("/changeUsername").post(verifyToken,changeUsername)
router.route("/changePassword").post(verifyToken,changePassword)
router.route("/changeAddress").post(verifyToken,changeAddress)
router.route("/changePhone").post(verifyToken,changePhone)
router.route("/fetchUserDetails").post(verifyToken,fetchUserDetails)
router.route("/verifyEmail").post(verifyEmail)
export default router