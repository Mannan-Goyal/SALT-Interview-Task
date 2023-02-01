import envHandler from './lib/env';

const port: string = envHandler('PORT');
const mongo: string = envHandler('MONGO');
const jwtSecret: string = envHandler('JWT_SECRET');

export { port, mongo, jwtSecret };
