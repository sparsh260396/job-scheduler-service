import { startJobProcessorConsumer } from './job_processor';

const startAllConsumers = () => {
  startJobProcessorConsumer();
};

export { startAllConsumers };
