import {Component, signal} from '@angular/core';
import {TableModule} from "primeng/table";
import {SessionService} from '../../service/session.service';
import Session from '../../model/session.model';
import {Button} from 'primeng/button';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-session-showcase',
  imports: [
    TableModule,
    Button,
    DatePipe
  ],
  templateUrl: './session-showcase.component.html',
  styles: ``
})
export class SessionShowcaseComponent {
  sessions = signal<Session[]>([]);

  constructor(
    private sessionService: SessionService
  ) {
    this.sessionService.getByUser().subscribe(sessions => {
      this.sessions.set(sessions);
    });
  }

  revoke(session: Session) {
    this.sessionService.revoke(session.id).subscribe(() => {
      this.sessions.update(sessions => sessions.filter(s => s.id !== session.id));
    });
  }
}
