import { Authentication, AuthenticationModel} from "../../../domain/usecases/authentication"
import { LoadAccountByEmailRepository } from "../../protocols/loadAccountByEmailRepository"

export class DbAuthentication implements Authentication{
  constructor(
    private readonly loadAccountByEmailRepository:LoadAccountByEmailRepository
  ){}
  async auth (authentication:AuthenticationModel):Promise<string>{
    await this.loadAccountByEmailRepository.load(authentication.email)
    return new Promise(resolve => resolve('aaaa'))
  }
}