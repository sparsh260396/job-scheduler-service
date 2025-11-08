import { isEmpty } from 'lodash';
import moment from 'moment';
import { HttpClient } from '../../common/http_client';
import { Logger } from '../../common/logger';
import { enqueueJob } from '../../sqs/producers/job_processor';
import { THRESHOLD_SECONDS } from './constants';
import { JobRespository } from './repositories/job.repository';
import { JobSchedulerRunDetailsRepository } from './repositories/job_run_details.repository';
import {
  JobSchedulerRunStatus,
  JobStatus,
  ScheduleJobInput,
  ScheduleJobOutput,
} from './types';

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
    // this will need to change
    // update the status of job to in-progress so it doesn't get picked up by the cron
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
  const getLastCompletedJobTime = (): Date => {
    if (isEmpty(lastCompletedRunDetails)) {
      return moment('2025-10-08').toDate();
    }
    return lastCompletedRunDetails.endTimeStamp;
  };

  const shouldRunCron = process.env.SHOULD_RUN_PROCESS_JOB_CRON!;
  if (!shouldRunCron) {
    Logger.warning({
      message: 'process job cron not allowed to run',
    });
    return;
  }
  const lastCompletedRunDetails =
    await JobSchedulerRunDetailsRepository.getLastCompletedRun();
  const startTime = getLastCompletedJobTime();
  const endTime = moment().add(THRESHOLD_SECONDS, 'seconds').toDate();
  const jobsBetweenRange = await JobRespository.getScheduledJobBetweenTimeRange(
    startTime,
    endTime,
  );
  const { runId } =
    await JobSchedulerRunDetailsRepository.createRunDetails(endTime);
  await JobRespository.updateJobBulk(
    jobsBetweenRange.map((job) => job.jobId),
    JobStatus.IN_PROGRESS,
  );
  jobsBetweenRange.forEach((job) => {
    enqueueJob({ jobId: job.jobId });
  });
  await JobSchedulerRunDetailsRepository.updateRunStatus(
    startTime,
    JobSchedulerRunStatus.COMPLETED,
  );
};

export const SchedulerService = { scheduleJob, handleJob, processJobs };
