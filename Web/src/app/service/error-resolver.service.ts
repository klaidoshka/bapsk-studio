import {Injectable, WritableSignal} from '@angular/core';
import Messages from '../model/messages.model';
import ErrorResponse, {ErrorResponseDetails} from '../model/error-response.model';

@Injectable({
  providedIn: 'root'
})
export class ErrorResolverService {
  private defaultErrorMessage = 'Extremely rare error occurred, please try again later.';

  constructor() {
  }

  resolveHttpResponseTo(response: any, messages: WritableSignal<Messages>) {
    messages.set({error: this.resolve(response)});
  }

  resolve(error: any): string[] {
    if (error instanceof Error) {
      return [error.message];
    } else if (typeof error === 'string') {
      return [error];
    } else {
      const errorResponse = error as ErrorResponse | null;

      if (errorResponse != null) {
        return errorResponse.error?.messages || [this.defaultErrorMessage];
      } else {
        const errorResponseDetails = error as ErrorResponseDetails | null;

        if (errorResponseDetails != null) {
          return errorResponseDetails.messages || [this.defaultErrorMessage];
        }
      }

      return [this.defaultErrorMessage];
    }
  }
}
