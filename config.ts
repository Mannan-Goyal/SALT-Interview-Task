import envHandler from './lib/env';

const port: string = envHandler('PORT');
const mongo: string = envHandler('MONGO');

export { port, mongo };
