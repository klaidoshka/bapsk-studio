import {provideHttpClient, withFetch, withInterceptors} from "@angular/common/http";
import {ApplicationConfig, inject, provideAppInitializer, provideExperimentalZonelessChangeDetection} from "@angular/core";
import {provideAnimationsAsync} from "@angular/platform-browser/animations/async";
import {provideRouter, withComponentInputBinding} from "@angular/router";
import {providePrimeNG} from "primeng/config";
import {routes} from "./app.routes";
import {authInterceptor} from "../interceptor/auth.interceptor";
import {AuthService} from "../service/auth.service";
import {ThemePreset} from './theme.preset';
import {ThemeService} from '../service/theme.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAppInitializer(() => {
      inject(ThemeService);
      inject(AuthService);
    }),
    provideExperimentalZonelessChangeDetection(),
    provideRouter(routes, withComponentInputBinding()),
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
