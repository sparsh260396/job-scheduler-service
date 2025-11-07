import { isEmpty, isNil } from 'lodash';
import { ScheduleJobInput } from './types';
import { HttpError } from '../../common/http_error';

const validateScheduleJobInput = (input: ScheduleJobInput) => {
  const { url, delayInSeconds } = input;
  if (isEmpty(url)) {
    throw new HttpError(400, 'url is required');
  }
  if (isNil(delayInSeconds)) {
    throw new HttpError(400, 'delayInSeconds is required');
  }
  if (delayInSeconds <= 0) {
    throw new HttpError(400, 'callback should be in future');
  }
};

export { validateScheduleJobInput };
