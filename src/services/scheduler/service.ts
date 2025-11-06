import moment from 'moment';
import { JobRespository } from './repository';
import { Job, JobStatus, ScheduleJobInput } from './types';
import { THREE_HUNDRED_SECONDS } from './constants';

const scheduleJob = async (input: ScheduleJobInput): Promise<Job> => {
  const { delayInSeconds, url, payload } = input;
  const callbackTimeStamp = moment().add(delayInSeconds, 'second');
  const createdJobDocument = await JobRespository.createJob({
    url,
    payload,
    callbackTime: callbackTimeStamp.toDate(),
    status: JobStatus.SCHEDULED,
    retryCount: 0,
  });
  if (delayInSeconds <= THREE_HUNDRED_SECONDS) {
    // additional step of adding to queue directly
  }
  return createdJobDocument;
};

export const SchedulerService = { scheduleJob };
