import { Router } from 'express';
import { SchedulerController } from './controller';

const router = Router();

router.post('/', SchedulerController.scheduleJob);
router.post('/cancel', SchedulerController.cancelJob);

export default router;
