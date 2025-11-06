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
  retryCount: number;
  callbackTime: Date;
  createdAt: Date;
  updatedAt: Date;
}

export { Job, JobStatus, ScheduleJobInput };
