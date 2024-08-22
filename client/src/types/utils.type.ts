export interface IErrorResponseApi<T> {
  message: string
  data?: T //generic type
}
export interface ISuccessResponseApi<T> {
  message: string
  data: T //generic type
}

//cu phap -? se loai bo undefine cua key optional (?:)
export type TNoUndefineField<T> = {
  [P in keyof T]-?: TNoUndefineField<NonNullable<T[P]>>
}
