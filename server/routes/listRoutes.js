import express from 'express';
const router = express.Router();
import { getLists, addList, deleteList } from '../controllers/listController.js';
import { protect } from '../middleware/auth.js';

router.route('/addList').post(protect, addList);
router.route('/getLists').get(protect, getLists);
router.route('/deleteList/:id').delete(deleteList);

export default router;