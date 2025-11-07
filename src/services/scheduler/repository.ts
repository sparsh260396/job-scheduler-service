import { JobModel } from './model';
import { Job, JobStatus } from './types';

const createJob = async (job: {
  url: string;
  payload: object;
  callbackTime: Date;
  status: string;
  retryCount: number;
}): Promise<Job> => {
  return await JobModel.create(job);
};

const findJobById = async (jobId: string): Promise<Job | null> => {
  return await JobModel.findOne({ jobId });
};

const updateJobStatus = async (
  jobId: string,
  status: JobStatus,
): Promise<Job | null> => {
  return await JobModel.findOneAndUpdate({ jobId }, { status });
};

export const JobRespository = {
  createJob,
  findJobById,
  updateJobStatus,
};
