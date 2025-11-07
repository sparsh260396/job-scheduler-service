import { JobModel } from './model';
import { Job, JobDocument, JobStatus } from './types';

const createJob = async (job: {
  url: string;
  payload: object;
  callbackTime: Date;
  status: string;
  retryCount: number;
}): Promise<JobDocument> => {
  const createdJobDocument = await JobModel.create(job);
  return {
    jobId: createdJobDocument._id.toString(),
    url: createdJobDocument.url,
    status: createdJobDocument.status,
    callbackTime: createdJobDocument.callbackTime,
  };
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
