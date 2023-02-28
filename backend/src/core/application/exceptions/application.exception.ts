interface ApplicationExceptionContract {
  name: string
  message: string
  status: number
}

export class ApplicationException
  extends Error
  implements ApplicationExceptionContract
{
  private readonly _name: string
  private readonly _message: string
  private readonly _status: number

  constructor(name: string, message: string, status: number) {
    super(message)

    this._name = name
    this._message = message
    this._status = status
  }

  public get name() {
    return this._name
  }

  public get message() {
    return this._message
  }

  public get status() {
    return this._status
  }
}
