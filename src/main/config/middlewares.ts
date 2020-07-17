import { Express } from 'express'
import { expressJson } from '../middlewares/express-json'
import { cors } from '../middlewares/cors'

export default (app: Express):void => {
  app.use(expressJson)
  app.use(cors)
}
