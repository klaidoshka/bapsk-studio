import {Component} from '@angular/core';
import {
  SessionShowcaseComponent
} from '../../component/session-showcase/session-showcase.component';

@Component({
  selector: 'app-session-page',
  imports: [
    SessionShowcaseComponent
  ],
  templateUrl: './session-page.component.html',
  styleUrl: './session-page.component.scss'
})
export class SessionPageComponent {

}
