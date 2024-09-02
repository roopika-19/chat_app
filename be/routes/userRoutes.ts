import express from 'express';
import { registerUser,authUser, allUsers } from '../controllers/userControllers';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// router.route("/").get(allUsers);
router.route('/register').post(registerUser).get(protect,allUsers);
router.route('/login').post(authUser);

export default router;
