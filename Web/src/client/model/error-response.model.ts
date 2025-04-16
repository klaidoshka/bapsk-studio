import {InternalFailure} from './internal-failure-code.model';

export default interface ErrorResponse {
  error: ErrorResponseDetails;
}

export interface ErrorResponseDetails {
  internalFailure?: InternalFailure;
  statusCode: number;
  messages: string[];
}
