import {Component, inject} from '@angular/core';
import {ProfileShowcaseComponent} from '../../component/profile-showcase/profile-showcase.component';
import {SessionShowcaseComponent} from '../../component/session-showcase/session-showcase.component';
import {AuthService} from '../../service/auth.service';
import {NgIf} from '@angular/common';

@Component({
  selector: 'profile-page',
  imports: [
    ProfileShowcaseComponent,
    SessionShowcaseComponent,
    NgIf
  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss'
})
export class ProfilePageComponent {
  private readonly authService = inject(AuthService);

  user = this.authService.getUser();
}
