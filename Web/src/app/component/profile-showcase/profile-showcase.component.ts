import {Component, Signal} from '@angular/core';
import {AuthService} from '../../service/auth.service';
import {User} from '../../model/user.model';
import {TableModule} from 'primeng/table';
import {Role} from '../../model/role.model';
import {getUserIsoCountryLabel} from "../../model/iso-country.model";

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

  readonly toRoleString = (role: Role): string => {
    return Role[role];
  }

  protected readonly getCountryName = getUserIsoCountryLabel;
}
