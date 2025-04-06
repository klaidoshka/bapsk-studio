import {Component, Signal} from "@angular/core";
import {RouterModule} from "@angular/router";
import {ConfirmationService, MessageService} from "primeng/api";
import {ButtonModule} from "primeng/button";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {ToastModule} from "primeng/toast";
import {ProfileDropdownComponent} from './component/profile-dropdown/profile-dropdown.component';
import {InstanceSelectorComponent} from './component/instance-selector/instance-selector.component';
import {ThemeSelectorComponent} from './component/theme-selector/theme-selector.component';
import {AuthService} from './service/auth.service';
import {NgIf} from '@angular/common';

@Component({
  selector: "app-root",
  imports: [RouterModule, ConfirmDialogModule, ButtonModule, ToastModule, ProfileDropdownComponent, InstanceSelectorComponent, ThemeSelectorComponent, NgIf],
  templateUrl: "./app.component.html",
  providers: [ConfirmationService, MessageService]
})
export class AppComponent {
  isAuthenticated!: Signal<boolean>;

  constructor(authService: AuthService) {
    this.isAuthenticated = authService.isAuthenticated();
  }
}
