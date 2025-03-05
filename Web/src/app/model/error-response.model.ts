export default interface ErrorResponse {
  error: ErrorResponseDetails;
}

export interface ErrorResponseDetails {
  statusCode: number;
  messages: string[];
}
