import express, { type Express, type Request, type Response } from 'express';
import { port } from './config';
const app: Express = express();

app.get('/', (req: Request, res: Response) => {
  res.json({ msg: 'Intervew Task for SALT' });
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
