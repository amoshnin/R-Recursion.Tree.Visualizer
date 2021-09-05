import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import buildRunner from './runner'
import { EventBody } from './types'

const app = express()
const port = 3000

app.use(cors())
app.use(express.json())

app.listen(port, () => {
  console.log(`Sever is running on port ${port}.`)
})

const generateTree = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const body: EventBody = request.body
  try {
    const run = buildRunner(body.lang, body.options)
    const treeViewerData = await run(body.functionData)

    if (treeViewerData.isError())
      return response.status(500).json(treeViewerData.value.reason)

    console.log(treeViewerData.value)
    return response.status(200).json(treeViewerData.value)
  } catch (e) {
    return response.status(500).json('Internal server error')
  }
}

app.post('/generateTree', generateTree)
