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
import {CardComponent} from '../card/card.component';

@Component({
  selector: 'session-showcase',
  imports: [
    TableModule,
    Button,
    DatePipe,
    ConfirmationComponent,
    Toast,
    CardComponent
  ],
  templateUrl: './session-showcase.component.html',
  providers: [MessageService],
  styles: ``
})
export class SessionShowcaseComponent {
  private readonly authService = inject(AuthService);
  private readonly messageService = inject(MessageService);
  private readonly sessionService = inject(SessionService);
  protected readonly confirmationComponent = viewChild.required(ConfirmationComponent);
  protected readonly currentSessionId = rxResource({loader: () => this.authService.getSessionId()});
  protected readonly sessions = rxResource({loader: () => this.sessionService.getByUser()});

  protected getActiveTime(session: Session): string {
    const diffInSeconds = Math.floor(((new Date()).getTime() - session.createdAt.getTime()) / 1000);

    const timeParts = {
      days: Math.floor(diffInSeconds / 86400),
      hours: Math.floor((diffInSeconds % 86400) / 3600),
      minutes: Math.floor((diffInSeconds % 3600) / 60),
      seconds: diffInSeconds % 60
    };

    let activeTime = '';

    if (timeParts.days > 0) {
      activeTime += `${timeParts.days}d `;
    }

    if (timeParts.hours > 0) {
      activeTime += `${timeParts.hours}h `;
    }

    if (timeParts.minutes > 0) {
      activeTime += `${timeParts.minutes}m `;
    }

    if (timeParts.seconds > 0) {
      activeTime += `${timeParts.seconds}s`;
    }

    return activeTime;
  }

  protected revoke(session: Session) {
    this.confirmationComponent().request(() => {
      this.sessionService.revoke(session.id).subscribe(() =>
        this.messageService.add({
          key: 'session-revokation',
          severity: 'success',
          summary: "Session",
          detail: "Session has been successfully revoked"
        })
      );
    });
  }
}
