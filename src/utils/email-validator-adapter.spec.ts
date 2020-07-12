import validator from 'validator'
import { EmailValidator } from '../presentation/protocols/emailValidator'

import { EmailValidatorAdapter } from './email-validator-adapter'

jest.mock('validator', () => ({
  isEmail ():boolean {
    return true
  }
}))

const makeSut = ():EmailValidator => {
  return new EmailValidatorAdapter()
}

describe('Email validator Adapter', () => {
  it('should return false if validator return false', () => {
    const sut = makeSut()
    jest.spyOn(validator, 'isEmail').mockImplementationOnce(() => false)
    const isValid = sut.isValid('invalid_email@mail.com')
    expect(isValid).toBe(false)
  })
  it('should return true if validator return true', () => {
    const sut = makeSut()
    const isValid = sut.isValid('valid_email@mail.com')
    expect(isValid).toBe(true)
  })
  it('should call validator with correct values', () => {
    const sut = makeSut()
    const verifyParams = jest.spyOn(validator, 'isEmail')

    sut.isValid('valid_email@mail.com')
    expect(verifyParams).toBeCalledWith('valid_email@mail.com')
  })
})
