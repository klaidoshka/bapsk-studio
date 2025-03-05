import {Component, Signal} from '@angular/core';
import {AuthService} from '../../service/auth.service';
import {User} from '../../model/auth.model';
import {TableModule} from 'primeng/table';

@Component({
  selector: 'app-profile-showcase',
  imports: [TableModule],
  templateUrl: './profile-showcase.component.html',
  styles: ``
})
export class ProfileShowcaseComponent {
  user!: Signal<User | null>;

  constructor(
    private authService: AuthService
  ) {
    this.user = this.authService.getUser();
  }
}
