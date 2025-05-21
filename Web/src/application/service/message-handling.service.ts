import {inject, Injectable, WritableSignal} from '@angular/core';
import Messages from '../model/messages.model';
import ErrorResponse, {ErrorResponseDetails} from '../model/error-response.model';
import {TranslateService} from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'

})
export class MessageHandlingService {
  private readonly translateService = inject(TranslateService);

  private isErrorResponse(obj: any): obj is ErrorResponse {
    return obj?.error?.messages !== undefined;
  }

  private isErrorResponseDetails(obj: any): obj is ErrorResponseDetails {
    return obj?.messages !== undefined && !obj?.error;
  }

  consumeError(error: any): string[] {
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
      const message = statusCode && this.translateService.instant("error.http-status." + statusCode);

      if (statusCode && message) {
        return [message];
      }
    }

    return [this.translateService.instant("error.http-status." + 500)];
  }

  consumeHttpErrorResponse(response: any, messages: WritableSignal<Messages>) {
    messages.set({error: this.consumeError(response)});
  }
}
