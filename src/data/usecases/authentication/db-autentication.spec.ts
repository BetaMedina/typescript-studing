import { AccountModel } from "../../../domain/models/account"
import { LoadAccountByEmailRepository } from "../../protocols/loadAccountByEmailRepository"
import { DbAuthentication } from "./db-autentication"

class loadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository{
  async load(email:string):Promise<AccountModel>{
    return new Promise(resolve=>resolve({
      id:'validId',
      name: 'validName',
      email:'validEmail',
      password:'validPassword'
    }))
  }
}

const makeSut= ()=>{
  const loadAccountByEmailRepository = new loadAccountByEmailRepositoryStub()
  const sut = new DbAuthentication(loadAccountByEmailRepository)
  return {
    sut,
    loadAccountByEmailRepository
  }
}    


describe("",()=>{
  it("Should call loadAccount by email with correct email",async()=>{
    const {loadAccountByEmailRepository,sut} = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepository,'load')
    await sut.auth({
      email:'any_email@mail.com',
      password:'any_password'
    })

    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })
})