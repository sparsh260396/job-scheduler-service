import { Router } from 'express';

import scheduler from '../services/scheduler';

const v1 = Router();

[scheduler].forEach(({ basePath, router }) => {
  v1.use(basePath, router);
});

export default v1;
