export interface HandleDto {
  [body:string]:{

    name: string,
    email: string,
    password: string,
    passwordConfirm: string
  }
}
