import { Encrypter } from '../../protocols/encrypter'
import { DbAddAccount } from './db-add-account'
describe('DbAddAccount UseCase', () => {
  it('Should call encrypter with correct password ', async () => {
    class EncrypterStub {
      async encrypt (value:string):Promise<string> {
        return new Promise(resolve => resolve('hashedValue'))
      }
    }

    const encrypterStub = new EncrypterStub()
    const sut = new DbAddAccount(encrypterStub)
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    const accountData = {
      name: 'validName',
      email: 'validMail',
      password: 'validPassword'
    }
    sut.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith('validPassword')
  })
})
