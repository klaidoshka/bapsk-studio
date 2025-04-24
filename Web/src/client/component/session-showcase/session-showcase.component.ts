import {Component, inject, viewChild} from '@angular/core';
import {TableModule} from "primeng/table";
import {SessionService} from '../../service/session.service';
import Session from '../../model/session.model';
import {Button} from 'primeng/button';
import {DatePipe} from '@angular/common';
import {AuthService} from '../../service/auth.service';
import {ConfirmationComponent} from '../confirmation/confirmation.component';
import {MessageService} from 'primeng/api';
import {Toast} from 'primeng/toast';
import {rxResource} from '@angular/core/rxjs-interop';

@Component({
  selector: 'session-showcase',
  imports: [
    TableModule,
    Button,
    DatePipe,
    ConfirmationComponent,
    Toast
  ],
  templateUrl: './session-showcase.component.html',
  providers: [MessageService],
  styles: ``
})
export class SessionShowcaseComponent {
  private readonly authService = inject(AuthService);
  private readonly messageService = inject(MessageService);
  private readonly sessionService = inject(SessionService);

  confirmationComponent = viewChild.required(ConfirmationComponent);
  currentSessionId = rxResource({ loader: () => this.authService.getSessionId() });
  sessions = rxResource({ loader: () => this.sessionService.getByUser() });

  revoke(session: Session) {
    this.confirmationComponent().request(() => {
      this.sessionService.revoke(session.id).subscribe(() =>
        this.messageService.add({
          key: 'session-revokation',
          severity: 'success',
          summary: "Session",
          detail: "Session has been successfully revoked"
        })
      );
    })
  }
}
