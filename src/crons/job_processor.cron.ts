import cron from 'node-cron';
import { Logger } from '../common/logger';
import { SchedulerService } from '../services/scheduler/service';

const startJobProcessorCron = () => {
  cron.schedule('*/5 * * * *', async () => {
    const startedAt = new Date().toISOString();
    Logger.info({
      message: 'jobProcessorCron started',
      key1: 'startedAt',
      key1_value: startedAt,
    });
    try {
      await SchedulerService.processJobs();
    } catch (err: any) {
      Logger.error({
        message: 'jobProcessorCron failed',
        error_message: err?.message,
      });
    }
    Logger.info({
      message: 'jobProcessorCron completed',
      key1: 'startedAt',
      key1_value: startedAt,
    });
  });
};

export { startJobProcessorCron };
