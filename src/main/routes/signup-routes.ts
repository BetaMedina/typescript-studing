import { Router } from 'express'
import { makeSignUpController } from '../factories/signUp/signup'
import { adaptRoute } from '../adapters/express-route-adapter'
 
export default (route: Router):void => {
  route.post('/signup', adaptRoute(makeSignUpController()))
}
