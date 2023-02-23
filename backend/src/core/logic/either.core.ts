class Left<L, R> {
  public readonly value: L

  constructor(value: L) {
    this.value = value
  }

  public isLeft(): this is Left<L, R> {
    return true
  }

  public isRight(): this is Right<L, R> {
    return false
  }
}

class Right<L, R> {
  public readonly value: R

  constructor(value: R) {
    this.value = value
  }

  public isLeft(): this is Left<L, R> {
    return false
  }

  public isRight(): this is Right<L, R> {
    return true
  }
}

export type Either<L, R> = Left<L, R> | Right<L, R>

export const left = <L, R>(left: L): Either<L, R> => {
  return new Left<L, R>(left)
}

export const right = <L, R>(right: R): Either<L, R> => {
  return new Right<L, R>(right)
}
