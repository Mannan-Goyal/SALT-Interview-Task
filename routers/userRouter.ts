import express, { type Request, type Response } from 'express';
import { signUp, login } from '../controllers/userController';
const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  res.json({ msg: 'User Router' });
});

router.post('/signup', signUp);
router.post('/login', login);

export default router;
