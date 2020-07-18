import express from 'express'
import Middlewares from './middlewares'
import SetupRoutes from './routes'

const app = express()
Middlewares(app)
SetupRoutes(app)
export default app
