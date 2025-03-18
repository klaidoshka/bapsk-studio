import {Component} from '@angular/core';
import {ProfileShowcaseComponent} from '../../component/profile-showcase/profile-showcase.component';
import {SessionShowcaseComponent} from '../../component/session-showcase/session-showcase.component';

@Component({
  selector: 'app-profile-page',
  imports: [
    ProfileShowcaseComponent,
    SessionShowcaseComponent
  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss'
})
export class ProfilePageComponent {

}
