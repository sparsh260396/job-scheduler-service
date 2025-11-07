import { NextFunction, Request, Response } from 'express';
import { SchedulerService } from './service';
import { validateScheduleJobInput } from './validations';

export async function scheduleJob(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const requestBody = request.body;
    validateScheduleJobInput(requestBody);
    const responseBody = await SchedulerService.scheduleJob(requestBody);
    response.status(201).json(responseBody);
  } catch (err) {
    next(err);
  }
}

export const SchedulerController = { scheduleJob };
