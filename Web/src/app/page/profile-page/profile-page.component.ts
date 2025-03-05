import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {
  ProfileShowcaseComponent
} from '../../component/profile-showcase/profile-showcase.component';

@Component({
  selector: 'app-profile-page',
  imports: [
    RouterOutlet,
    ProfileShowcaseComponent
  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss'
})
export class ProfilePageComponent {

}
