import { Message } from '@aws-sdk/client-sqs';
import { Consumer } from 'sqs-consumer';
import { Logger } from '../../../common/logger';
import { RequestContext } from '../../../middlewares/request_context';
import { SqsClient } from '../../sqsClient';
import { handleJobProcessor } from './handler';

const startJobProcessorConsumer = () => {
  const queueUrl = process.env.SQS_JOB_PROCESSOR_URL!;
  const consumer = Consumer.create({
    queueUrl,
    handleMessage: async (message: Message): Promise<Message | undefined> => {
      const requestId = crypto.randomUUID();
      return RequestContext.runWithRequestId(requestId, async () => {
        const body = JSON.parse(message.Body!);
        try {
          await handleJobProcessor(body);
        } catch (err: any) {
          Logger.error({
            message: 'error processing message',
            key1: 'messageDetails',
            key1_value: JSON.stringify(message),
          });
        }
        return Promise.resolve(undefined);
      });
    },
    sqs: SqsClient,
    batchSize: 10,
  });

  consumer.on('error', (err: any) => {
    Logger.error({ message: 'SQS consumer error', error_message: err.message });
  });

  consumer.on('processing_error', (err: any) => {
    Logger.error({ message: 'Processing error', error_message: err.message });
  });

  consumer.on('message_received', () => {
    Logger.info({ message: 'JobCreated message received' });
  });

  consumer.start();

  Logger.info({ message: 'Job processor consumer started succesfully' });
};

export { startJobProcessorConsumer };
