import { JobModel } from '../models/job.model';
import { Job, JobDocument, JobStatus } from '../types';

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
  return JobModel.findOneAndUpdate({ jobId }, { status });
};

const updateJobBulk = async (jobIds: string[], status: JobStatus) => {
  JobModel.updateMany({ _id: { $in: jobIds } }, { status });
};

const getScheduledJobBetweenTimeRange = async (
  startTime: Date,
  endTime: Date,
): Promise<JobDocument[]> => {
  return JobModel.find({
    createdAt: { $gt: startTime, $lte: endTime },
    status: JobStatus.SCHEDULED,
  });
};

export const JobRespository = {
  createJob,
  findJobById,
  updateJobStatus,
  getScheduledJobBetweenTimeRange,
  updateJobBulk,
};
