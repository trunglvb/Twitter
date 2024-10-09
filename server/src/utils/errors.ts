import { HttpStatusCode } from '@/constants/enums';

export type ErrorResponse = {
  msg: string;
};
type ErrorType = Record<string, ErrorResponse>; //  {[key: string]: define type}

export class ErrorWithStatus {
  message: string;
  status: number;

  constructor({ message, status }: { message: string; status: number }) {
    this.message = message;
    this.status = status;
  }
}

//dung cho loi 422
export class EntityError extends ErrorWithStatus {
  errors: ErrorType;
  constructor({ message = 'Validation error', errors }: { message?: string; errors: ErrorType }) {
    super({ message, status: HttpStatusCode.UnprocessableEntity }); //extend thi can super

    this.errors = errors;
  }
}
