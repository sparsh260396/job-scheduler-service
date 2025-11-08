import { startJobProcessorCron } from './job_processor.cron';

const startCrons = () => {
  startJobProcessorCron();
};

export { startCrons };
