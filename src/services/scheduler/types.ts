interface ScheduleJobInput {
  url: string;
  payload: Object;
  delayInSeconds: number;
  source: string;
}

enum JobStatus {
  SUCCESS = 'success',
  FAILURE = 'failure',
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
}

type ScheduleJobOutput = JobDocument;

export { Job, JobDocument, JobStatus, ScheduleJobInput, ScheduleJobOutput };
