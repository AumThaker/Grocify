import { Router } from 'express'
import { checkLoginToken, loginUser, logoutUser, register, registerOtpSent, registerUser } from '../controllers/usercontrol.js';
import verifyToken from '../middlewares/token.js';
const router = Router();
router.route("/registerUser").post(registerUser)
router.route("/register").post(register)
router.route("/loginUser").post(loginUser)
router.route("/logoutUser").post(verifyToken,logoutUser)
router.route("/registerOtpCreate").post(registerOtpSent)
router.route("/checkLoginToken").post(checkLoginToken)
export default router