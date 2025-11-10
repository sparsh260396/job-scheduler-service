import { NextFunction, Request, Response } from 'express';
import { SchedulerService } from './service';
import {
  validateCancelJobRequest,
  validateScheduleJobRequest,
} from './validations';

const scheduleJob = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const requestBody = request.body;
    validateScheduleJobRequest(requestBody);
    const responseBody = await SchedulerService.scheduleJob(requestBody);
    response.status(201).json(responseBody);
  } catch (err) {
    next(err);
  }
};

const cancelJob = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const requestBody = request.body;
    validateCancelJobRequest(requestBody);
    const responseBody = await SchedulerService.cancelJob(requestBody);
    response.status(201).json(responseBody);
  } catch (err) {
    next(err);
  }
};

export const SchedulerController = { scheduleJob, cancelJob };
