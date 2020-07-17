import { Express } from 'express'
import { expressJson } from '../middlewares/express-json'

export default (app: Express):void => {
  app.use(expressJson)
}
