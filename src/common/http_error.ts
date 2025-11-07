class HttpError extends Error {
  code: string = 'ERROR';
  status: number;

  constructor(status: number, message: string, code?: string) {
    super(message);
    this.status = status;
    if (code) this.code = code;
  }
}

export { HttpError };
