import { Router } from 'express'
import { loginUser, logoutUser, registerUser } from '../controllers/usercontrol.js';
import verifyToken from '../middlewares/token.js';
const router = Router();
router.route("/registerUser").post(registerUser)
router.route("/loginUser").post(loginUser)
router.route("/logoutUser").post(verifyToken,logoutUser)
export default router