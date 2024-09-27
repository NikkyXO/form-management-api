export const configuration = (): object => ({
  port: parseInt(process.env.PORT as unknown as string, 10) || 3000,
  env: process.env.NODE_ENV || 'local',
  mongoDBURI: process.env.MONGODB_URI,
});
