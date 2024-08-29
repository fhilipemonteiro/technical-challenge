import z from 'zod';
import dotenv from 'dotenv';
dotenv.config();

const EnvSchema = z.object({
  PORT: z.string({
    required_error: 'PORT is required in .env',
  }),

  DB_HOST: z.string({
    required_error: 'DB_HOST is required in .env',
  }),
  DB_USER: z.string({
    required_error: 'DB_USER is required in .env',
  }),
  DB_PASSWORD: z.string({
    required_error: 'DB_PASSWORD is required in .env',
  }),
  DB_NAME: z.string({
    required_error: 'DB_NAME is required in .env',
  }),

  GEMINI_API_KEY: z.string({
    required_error: 'GEMINI_API_KEY is required in .env',
  }),
});

const env = EnvSchema.parse(process.env);

export default env;