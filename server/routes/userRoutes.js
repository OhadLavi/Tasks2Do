import express from 'express';
const router = express.Router();
import { loginUser, registerUser } from '../controllers/userController.js';

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);

export default router;
