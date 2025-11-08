import { JobSchedulerRunDetailsModel } from '../models/job_scheduler_run_details.model';
import {
  JobSchedulerRunDetails,
  JobSchedulerRunDetailsDocument,
  JobSchedulerRunStatus,
} from '../types';

const getLastCompletedRun =
  async (): Promise<JobSchedulerRunDetails | null> => {
    return JobSchedulerRunDetailsModel.findOne(
      {
        status: JobSchedulerRunStatus.COMPLETED,
      },
      { sort: { createdAt: -1 } },
    );
  };

const createRunDetails = async (
  endTime: Date,
): Promise<JobSchedulerRunDetailsDocument> => {
  const result = await JobSchedulerRunDetailsModel.create({
    status: JobSchedulerRunStatus.IN_PROGRESS,
    endTimeStamp: endTime,
  });
  return {
    runId: result._id.toString(),
    endTimeStamp: result.endTimeStamp,
    createdAt: result.createdAt,
    updatedAt: result.updatedAt,
    status: result.status,
  };
};

const updateRunStatus = async (
  endTimeStamp: Date,
  status: JobSchedulerRunStatus,
) => {
  JobSchedulerRunDetailsModel.updateMany(
    { endTimeStamp: { $gte: endTimeStamp } },
    { status },
  );
};

export const JobSchedulerRunDetailsRepository = {
  getLastCompletedRun,
  createRunDetails,
  updateRunStatus,
};
