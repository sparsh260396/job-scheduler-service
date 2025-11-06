import { JobModel } from './model';
import { Job } from './types';

const createJob = async (job: {
  url: string;
  payload: object;
  callbackTime: Date;
  status: string;
  retryCount: number;
}): Promise<Job> => {
  return await JobModel.create(job);
};

export const JobRespository = {
  createJob,
};
