import { config } from 'dotenv'

config()

export const AWS_CONFIG = {
  BUCKET_NAME: process.env.AWS_BUCKET_NAME,
  BUCKET_REGION: process.env.AWS_BUCKET_REGION,
  PUBLIC_KEY: process.env.AWS_PUBLIC_KEY,
  SECRET_KEY: process.env.AWS_SECRET_KEY
}
