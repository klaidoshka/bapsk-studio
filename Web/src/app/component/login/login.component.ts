import {Component, inject, OnInit, signal} from "@angular/core";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import {Button} from "primeng/button";
import {LoginRequest} from "../../model/auth.model";
import ErrorResponse from "../../model/error-response.model";
import {AuthService} from "../../service/auth.service";
import {TextService} from "../../service/text.service";
import {MessageService} from "primeng/api";
import {InputText} from "primeng/inputtext";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  imports: [Button, ReactiveFormsModule, FormsModule, RouterLink, InputText],
  providers: [MessageService]
})
export class LoginComponent implements OnInit {
  private authService = inject(AuthService);
  private formBuilder = inject(FormBuilder);
  private messageService = inject(MessageService);
  private router = inject(Router);
  private textService = inject(TextService);

  $loginForm!: FormGroup;
  $isSubmitting = signal<boolean>(false);
  $messages = signal<string[]>([]);

  ngOnInit(): void {
    this.$loginForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(8)]]
    });
  }

  getErrorMessage(field: string): string | null {
    const control = this.$loginForm.get(field);

    if (!control || !control.touched || !control.invalid) return "";
    if (control.errors?.["required"])
      return `${this.textService.capitalize(field)} is required.`;
    if (control.errors?.["email"]) return "Please enter a valid email address.";
    if (control.errors?.["minlength"])
      return "Password must be at least 8 characters long.";

    return null;
  }

  async onSubmit(): Promise<void> {
    if (this.$isSubmitting()) return;
    if (this.$messages.length != 0) this.$messages.set([]);
    if (this.$loginForm.invalid) return;

    this.$isSubmitting.set(true);

    const request: LoginRequest = {
      email: this.$loginForm.value.email,
      password: this.$loginForm.value.password
    };

    this.authService.login(request).subscribe({
      next: (response) => {
        this.authService.acceptAuthResponse(response);
        this.$isSubmitting.set(false);

        this.router.navigate(["/"]).then(() => {
          this.messageService.add({
            key: "root",
            severity: "success",
            summary: "Logged in",
            detail: "You have successfully logged in"
          });
        })
      },
      error: (response: ErrorResponse) => {
        this.$messages.set(response.error?.messages || [
          "Failed to log you in, please try again..."
        ]);
        this.$isSubmitting.set(false);
      }
    });
  }
}
