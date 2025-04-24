import {Injectable, WritableSignal} from '@angular/core';
import Messages from '../model/messages.model';
import ErrorResponse, {ErrorResponseDetails} from '../model/error-response.model';

@Injectable({
  providedIn: 'root'
})
export class ErrorMessageResolverService {
  private readonly defaultErrorMessage = 'Unknown error occurred, please try again later.';

  private readonly statusCodeMessages: Record<number, string> = {
    400: 'Bad Request. Please check your inputs.',
    401: 'Unauthorized. Please log in again.',
    403: 'Forbidden. Please check your permissions.',
    404: 'Not Found. The requested resource could not be found.',
    500: this.defaultErrorMessage
  }

  private isErrorResponse(obj: any): obj is ErrorResponse {
    return obj?.error?.messages !== undefined;
  }

  private isErrorResponseDetails(obj: any): obj is ErrorResponseDetails {
    return obj?.messages !== undefined && !obj?.error;
  }

  resolveError(error: any): string[] {
    if (error instanceof Error) {
      return [error.message];
    } else if (typeof error === 'string') {
      return [error];
    } else if (this.isErrorResponse(error)) {
      return error.error.messages;
    } else if (this.isErrorResponseDetails(error)) {
      return error.messages;
    } else {
      const statusCode = error?.status as number | undefined || 400;

      if (statusCode && this.statusCodeMessages[statusCode]) {
        return [this.statusCodeMessages[statusCode]];
      }
    }

    return [this.defaultErrorMessage];
  }

  resolveHttpErrorResponseTo(response: any, messages: WritableSignal<Messages>) {
    messages.set({ error: this.resolveError(response) });
  }
}
