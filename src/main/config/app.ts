import express from 'express'
import Middlewares from './middlewares'

const app = express()
Middlewares(app)

export default app
