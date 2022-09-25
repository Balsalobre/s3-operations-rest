import express from 'express'
import fileUpload from 'express-fileupload'
import { uploadFile, getFiles, getFile, downLoadFile, getFileURL } from './s3.js'

const app = express()

app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: './uploads'
}))

app.get('/', (req, res) => {
  res.json({ message: 'Wellcome to S3 server'})
})

app.get('/files', async (req, res) => {
  const { Contents } = await getFiles()
  res.json({ result: Contents })
})

app.get('/files/:fileName', async (req, res) => {
  const { fileName } = req.params
  const { $metadata } = await getFile(fileName)
  res.send({ result: $metadata })
})

app.get('/file-url/:fileName', async (req, res) => {
  const { fileName } = req.params
  const url = await getFileURL(fileName)
  res.send({ result: { url } })
})

app.get('/download-img/:fileName', async (req, res) => {
  const { fileName } = req.params
  await downLoadFile(fileName, 'image')
  res.send({ result: 'File downloaded successfully' })
})

app.post('/files', async ({ files }, res) => {
  const fileUploaded = await uploadFile(files.file)
  res.json({ result: fileUploaded })
})

app.use(express.static('images'))

app.listen(3000)

console.log(`Express server listening on http://localhost:${3000}`)

