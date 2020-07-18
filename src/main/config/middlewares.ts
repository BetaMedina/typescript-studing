import { Express } from 'express'
import { expressJson } from '../middlewares/express-json'
import { cors } from '../middlewares/cors'
import { contentType } from '../middlewares/content-type'

export default (app: Express):void => {
  app.use(expressJson)
  app.use(cors)
  app.use(contentType)
}
