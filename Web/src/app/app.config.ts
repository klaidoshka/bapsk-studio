import {provideHttpClient, withFetch, withInterceptors} from "@angular/common/http";
import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideZoneChangeDetection
} from "@angular/core";
import {provideAnimationsAsync} from "@angular/platform-browser/animations/async";
import {provideRouter, Router} from "@angular/router";
import {providePrimeNG} from "primeng/config";
import {routes} from "./app.routes";
import {authInterceptor} from "./interceptor/auth.interceptor";
import {AuthService} from "./service/auth.service";
import {ThemePreset} from './theme-preset';

function initAuthService(authService: AuthService, router: Router): Promise<void> {
  return new Promise((resolve, _) => {
    if (!authService.isAuthenticated()()) {
      return resolve();
    }
    
    authService.renewAccess().subscribe({
      next: (response) => {
        authService.acceptAuthResponse(response);
        router.navigate(["/"]);
        resolve();
      },
      error: () => {
        authService.cleanupCredentials();
        router.navigate(["/auth/login"]);
        resolve();
      }
    });
  });
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideAppInitializer(() => {
      initAuthService(inject(AuthService), inject(Router));
    }),
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    provideAnimationsAsync(),
    providePrimeNG({
      ripple: true,
      theme: {
        preset: ThemePreset,
        options: {
          darkModeSelector: '.dark'
        }
      }
    })
  ]
};
