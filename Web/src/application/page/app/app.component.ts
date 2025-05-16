import {Component} from "@angular/core";
import {RouterModule} from "@angular/router";
import {ConfirmationService, MessageService} from "primeng/api";
import {ButtonModule} from "primeng/button";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {ToastModule} from "primeng/toast";
import {ScrollToTopComponent} from '../../component/scroll-to-top/scroll-to-top.component';

@Component({
  selector: "root",
  imports: [RouterModule, ConfirmDialogModule, ButtonModule, ToastModule, ScrollToTopComponent],
  templateUrl: "./app.component.html",
  providers: [ConfirmationService, MessageService]
})
export class AppComponent {

}
