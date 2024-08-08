import { Router } from 'express';
import { claimTask, createTask, getTasks, updateTaskStatus } from '../controllers/userController.js';
const router = Router();


// Tasks routes
router.post('/tasks', getTasks);
router.post('/claim-task', claimTask);
router.post('/update-task-status', updateTaskStatus);
router.post('/create-task', createTask);

export default router;
