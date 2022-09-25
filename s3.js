import {
  S3Client,
  PutObjectCommand,
  ListObjectsCommand,
  GetObjectCommand
} from '@aws-sdk/client-s3'
import { AWS_CONFIG } from './config.js'
import fs from 'fs'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const client = new S3Client({
  region: AWS_CONFIG.BUCKET_REGION,
  credentials: {
    accessKeyId: AWS_CONFIG.PUBLIC_KEY,
    secretAccessKey: AWS_CONFIG.SECRET_KEY,
  }
})

const createDirIfNotExists = (name) => {
  if(!fs.existsSync(name)) fs.mkdirSync(name)
}

export const uploadFile = async ({ tempFilePath, name }) => {
  const stream = fs.createReadStream(tempFilePath)
  const uploadParams = {
    Bucket: AWS_CONFIG.BUCKET_NAME,
    Key: name,
    Body: stream,
  }
  const command = new PutObjectCommand(uploadParams)
  return await client.send(command)
}

export const getFiles = async () => {
  const command = new ListObjectsCommand({
    Bucket: AWS_CONFIG.BUCKET_NAME,
  })
  return await client.send(command)
}

export const getFile = async (fileName) => {
  const command = new GetObjectCommand({
    Bucket: AWS_CONFIG.BUCKET_NAME,
    Key: fileName
  })
  return await client.send(command)
}

export const downLoadFile = async (fileName, type) => {
  const command = new GetObjectCommand({
    Bucket: AWS_CONFIG.BUCKET_NAME,
    Key: fileName
  })
  const result = await client.send(command)
  createDirIfNotExists(`${type}s`)
  result.Body.pipe(fs.createWriteStream(`./images/${fileName}`))
}

export const getFileURL = async (fileName) => {
  const command = new GetObjectCommand({
    Bucket: AWS_CONFIG.BUCKET_NAME,
    Key: fileName
  })
  return await getSignedUrl(client, command, { expiresIn: 3600 })
}