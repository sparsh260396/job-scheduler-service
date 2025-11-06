import { Router } from 'express';
import { SchedulerController } from './controller';

const router = Router();

router.post('/', SchedulerController.scheduleJob);

export default router;
