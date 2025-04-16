import {FailureCode} from './failure-code.model';
import {EnumUtil} from '../util/enum.util';

export default interface ErrorResponse {
  error: ErrorResponseDetails;
}

export interface ErrorResponseDetails {
  codes: FailureCode[];
  statusCode: number;
  messages: string[];
}

export const containsFailureCode = (response: ErrorResponse | undefined, code: FailureCode): boolean => {
  return extractFailureCodes(response).some(failureCode => failureCode === code);
}

export const extractFailureCodes = (response: ErrorResponse | undefined): FailureCode[] => {
  if (response?.error?.codes == null) {
    return [];
  }

  return response.error.codes.map(code => EnumUtil.toEnumOrThrow(code, FailureCode));
}
