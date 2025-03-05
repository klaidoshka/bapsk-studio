import {Component} from "@angular/core";
import {RouterModule} from "@angular/router";
import {ConfirmationService, MessageService} from "primeng/api";
import {ButtonModule} from "primeng/button";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {ToastModule} from "primeng/toast";
import {ProfileDropdownComponent} from './component/profile-dropdown/profile-dropdown.component';
import {InstanceSelectorComponent} from './component/instance-selector/instance-selector.component';

@Component({
  selector: "app-root",
  imports: [RouterModule, ConfirmDialogModule, ButtonModule, ToastModule, ProfileDropdownComponent, InstanceSelectorComponent],
  templateUrl: "./app.component.html",
  providers: [ConfirmationService, MessageService]
})
export class AppComponent {
}
