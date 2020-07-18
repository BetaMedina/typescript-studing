import { Express } from 'express'
import { contentType, expressJson, cors } from '../middlewares/'

export default (app: Express):void => {
  app.use(expressJson)
  app.use(cors)
  app.use(contentType)
}
