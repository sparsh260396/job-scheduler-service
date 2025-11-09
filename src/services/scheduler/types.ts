interface ScheduleJobInput {
  url: string;
  payload: Object;
  delayInSeconds: number;
  source: string;
}

enum JobStatus {
  SUCCESS = 'success',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  IN_PROGRESS = 'inProgress',
  SCHEDULED = 'scheduled',
}

interface Job extends Document {
  url: string;
  payload: object;
  status: JobStatus;
  callbackTime: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface JobDocument {
  jobId: string;
  url: string;
  status: JobStatus;
  callbackTime: Date;
  payload: object;
}

enum JobSchedulerRunStatus {
  IN_PROGRESS = 'inProgress',
  COMPLETED = 'completed',
}

interface JobSchedulerRunDetails {
  endTimeStamp: Date;
  status: JobSchedulerRunStatus;
  createdAt: Date;
  updatedAt: Date;
}

interface JobSchedulerRunDetailsDocument {
  endTimeStamp: Date;
  status: JobSchedulerRunStatus;
  createdAt: Date;
  updatedAt: Date;
  runId: string;
}

type ScheduleJobOutput = JobDocument;

export {
  Job,
  JobDocument,
  JobSchedulerRunDetails,
  JobSchedulerRunStatus,
  JobStatus,
  ScheduleJobInput,
  ScheduleJobOutput,
  JobSchedulerRunDetailsDocument,
};
