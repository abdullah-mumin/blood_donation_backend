/* eslint-disable @typescript-eslint/no-explicit-any */
export type TErrorSources = {
  field: string | number;
  message: string;
}[];

export type TGenericErrorResponse = {
  statusCode: number;
  message: string;
  errorDetails: any;
  errorSources: TErrorSources;
};
