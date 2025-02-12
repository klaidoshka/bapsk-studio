import {Component, inject, OnInit} from "@angular/core";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import {Button} from "primeng/button";
import {LoginRequest} from "../../model/auth.model";
import ErrorResponse from "../../model/error-response.model";
import {AuthService} from "../../service/auth.service";
import {TextService} from "../../service/text.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
  imports: [Button, ReactiveFormsModule, FormsModule, RouterLink]
})
export class LoginComponent implements OnInit {
  private authService = inject(AuthService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private textService = inject(TextService);

  loginForm!: FormGroup;
  isSubmitting = false;
  messages: string[] = [];

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(8)]]
    });
  }

  getErrorMessage(field: string): string | null {
    const control = this.loginForm.get(field);

    if (!control || !control.touched || !control.invalid) return "";
    if (control.errors?.["required"])
      return `${this.textService.capitalize(field)} is required.`;
    if (control.errors?.["email"]) return "Please enter a valid email address.";
    if (control.errors?.["minlength"])
      return "Password must be at least 8 characters long.";

    return null;
  }

  async onSubmit(): Promise<void> {
    if (this.isSubmitting) return;
    if (this.messages.length != 0) this.messages = [];
    if (this.loginForm.invalid) return;

    this.isSubmitting = true;

    const request: LoginRequest = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

    this.authService.login(request).subscribe({
      next: (response) => {
        if (response) {
          this.authService.acceptAuthResponse(response);
          this.router.navigate(["/"]);
        }
        this.isSubmitting = false;
      },
      error: (response: ErrorResponse) => {
        this.messages = response.error?.messages || [
          "Failed to log you in, please try again..."
        ];
        this.isSubmitting = false;
      }
    });
  }
}
