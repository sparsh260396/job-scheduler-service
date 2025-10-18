import { Router } from 'express';

const v1 = Router();
[].forEach(({ basePath, router }) => {
  v1.use(basePath, router);
});

export default v1;
