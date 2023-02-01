import express, { type Express, type Request, type Response } from 'express';
import mongoose from 'mongoose';
import { port, mongo } from './config';

const app: Express = express();
mongoose.set('strictQuery', true);
mongoose.connect(mongo, (err) => {
  if (err) throw err;
  console.log('📙[server]: Database successfully connected!');
});

app.get('/', (req: Request, res: Response) => {
  res.json({ msg: 'Intervew Task for SALT' });
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
