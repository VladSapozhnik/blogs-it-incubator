// domain/domain-exception.ts
export type ErrorMessage = {
  message: string;
  field: string;
};

export class DomainException extends Error {
  readonly status: number;
  readonly errorsMessages: ErrorMessage[];

  constructor(params: { status: number; errorsMessages: ErrorMessage[] }) {
    super('Domain exception');
    Object.setPrototypeOf(this, new.target.prototype);
    this.status = params.status;
    this.errorsMessages = params.errorsMessages;
  }
}
