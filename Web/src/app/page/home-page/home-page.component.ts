import {Component} from "@angular/core";
import {RouterModule} from "@angular/router";
import {ConfirmationService, MessageService} from "primeng/api";
import {ButtonModule} from "primeng/button";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {ToastModule} from "primeng/toast";

@Component({
  selector: "app-home-page",
  imports: [ButtonModule, ConfirmDialogModule, RouterModule, ToastModule],
  templateUrl: "./home-page.component.html",
  providers: [ConfirmationService, MessageService]
})
export class HomePageComponent {}
