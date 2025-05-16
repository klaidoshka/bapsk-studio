import {Component} from "@angular/core";
import {RouterModule} from "@angular/router";
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: "auth-page",
  imports: [RouterModule, TranslatePipe],
  templateUrl: "./auth-page.component.html"
})
export class AuthPageComponent {
}
