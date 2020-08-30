import { rejects } from 'assert'
import { AccountModel } from '../../../domain/models/account'
import { LoadAccountByEmailRepository } from '../../protocols/loadAccountByEmailRepository'
import { DbAuthentication } from './db-autentication'

class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
  async load (email:string):Promise<AccountModel> {
    return new Promise(resolve => resolve({
      id: 'validId',
      name: 'validName',
      email: 'validEmail',
      password: 'validPassword'
    }))
  }
}

interface SutTypes{
  loadAccountByEmailRepository:LoadAccountByEmailRepository
  sut:DbAuthentication
}

const makeSut = ():SutTypes => {
  const loadAccountByEmailRepository = new LoadAccountByEmailRepositoryStub()
  const sut = new DbAuthentication(loadAccountByEmailRepository)
  return {
    sut,
    loadAccountByEmailRepository
  }
}    

describe('', () => {
  it('Should call loadAccount by email with correct email', async () => {
    const { loadAccountByEmailRepository, sut } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepository, 'load')
    await sut.auth({
      email: 'any_email@mail.com',
      password: 'any_password'
    })

    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })
  it('Teste throw in dbAuth', async () => {
    const { loadAccountByEmailRepository, sut } = makeSut()
    jest.spyOn(loadAccountByEmailRepository, 'load').mockReturnValue(
      new Promise((resolve, reject) => reject(new Error('error')))
    )

    expect(sut.auth({
      email: 'any_email@mail.com',
      password: 'any_password'
    })).rejects.toThrow('error')
  })
})
