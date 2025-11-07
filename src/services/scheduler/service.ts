import { isEmpty } from 'lodash';
import moment from 'moment';
import { HttpClient } from '../../common/http_client';
import { Logger } from '../../common/logger';
import { enqueueJob } from '../../sqs/producers/job_processor';
import { THRESHOLD_SECONDS } from './constants';
import { JobRespository } from './repository';
import { JobStatus, ScheduleJobInput, ScheduleJobOutput } from './types';

const scheduleJob = async (
  input: ScheduleJobInput,
): Promise<ScheduleJobOutput> => {
  const { delayInSeconds, url, payload } = input;
  const callbackTimeStamp = moment().add(delayInSeconds, 'second');
  const createdJob = await JobRespository.createJob({
    url,
    payload,
    callbackTime: callbackTimeStamp.toDate(),
    status: JobStatus.SCHEDULED,
    retryCount: 0,
  });
  if (delayInSeconds <= THRESHOLD_SECONDS) {
    await enqueueJob({ jobId: createdJob.jobId });
  }
  return createdJob;
};

const handleJob = async (jobId: string): Promise<void> => {
  Logger.info({
    message: 'started processing job',
    key1: 'job',
    key1_value: jobId,
  });
  const jobDetails = await JobRespository.findJobById(jobId);
  if (isEmpty(jobDetails)) {
    Logger.error({
      key1: 'jobId',
      key1_value: jobId,
      message: 'no job details found',
    });
    return;
  }
  const { status, url, payload } = jobDetails;
  if (status === JobStatus.CANCELLED) {
    Logger.info({
      key1: 'jobId',
      key1_value: jobId,
      message: 'job has been cancelled, not proceeding further',
    });
    return;
  }
  try {
    await HttpClient.post(url, payload, {
      headers: {
        'x-idempotency-key': jobId,
      },
    });
    await JobRespository.updateJobStatus(jobId, JobStatus.SUCCESS);
  } catch (err: any) {
    Logger.error({
      message: 'failed to complete job',
      key1: 'job',
      key1_value: jobId,
      error_message: err.message,
    });
    await JobRespository.updateJobStatus(jobId, JobStatus.FAILURE);
  }
};

const processJobs = async () => {
  const shouldRunCron = process.env.SHOULD_RUN_PROCESS_JOB_CRON!;
  if (!shouldRunCron) {
    Logger.warning({
      message: 'process job cron not allowed to run',
    });
    return;
  }
  // take the timestamp approach to be consistent
};

export const SchedulerService = { scheduleJob, handleJob };
