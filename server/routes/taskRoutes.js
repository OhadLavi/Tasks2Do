import express from 'express';
const router = express.Router();
import { getTasks, addTasks, completeTask, deleteTask, updateTask } from '../controllers/taskController.js';
import { protect } from '../middleware/auth.js';

router.route('/getTasks/:id/:listId').get(protect, getTasks);
router.route('/addTasks').post(protect, addTasks);
router.route('/updateTask/:id').put(protect, updateTask);
router.route('/completeTask/:id').put(completeTask);
router.route('/deleteTask/:id').delete(deleteTask);

export default router;