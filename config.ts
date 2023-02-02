import envHandler from './lib/env';

const port: string = envHandler('PORT');
const mongo: string = envHandler('MONGO');
const jwtSecret: string = envHandler('JWT_SECRET');
const clientId: string = envHandler('GOOGLE_CLIENT_ID');
const clientSecret: string = envHandler('GOOGLE_CLIENT_SECRET');
const redirectUrl: string = envHandler('GOOGLE_OAUTH_REDIRECT_URL');

export { port, mongo, jwtSecret, clientId, clientSecret, redirectUrl };
