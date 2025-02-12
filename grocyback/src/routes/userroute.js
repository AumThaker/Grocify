import { Router } from 'express'
import { loginUser, logoutUser, registerOtpSent, registerUser } from '../controllers/usercontrol.js';
import verifyToken from '../middlewares/token.js';
const router = Router();
router.route("/registerUser").post(registerUser)
router.route("/loginUser").post(loginUser)
router.route("/logoutUser").post(verifyToken,logoutUser)
router.route("/registerOtpCreate").post(registerOtpSent)
export default router