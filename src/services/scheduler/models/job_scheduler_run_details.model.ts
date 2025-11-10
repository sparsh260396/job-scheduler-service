import mongoose, { Schema } from 'mongoose';
import { JobSchedulerRunDetails, JobSchedulerRunStatus } from '../types';

const JobSchedulerRunDetailsSchema = new Schema<JobSchedulerRunDetails>(
  {
    status: {
      type: String,
      enum: JobSchedulerRunStatus,
      required: true,
    },
    endTimeStamp: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const JobSchedulerRunDetailsModel =
  mongoose.model<JobSchedulerRunDetails>(
    'internal_job_run_details',
    JobSchedulerRunDetailsSchema,
  );
