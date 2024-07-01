export interface IPlainObject {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface IErrorResponse {
  response: {
    data: {
      message: string;
      error: string;
    };
    status: number;
  };
}
