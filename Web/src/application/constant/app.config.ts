import {provideHttpClient, withFetch, withInterceptors} from "@angular/common/http";
import {
  ApplicationConfig,
  importProvidersFrom,
  inject,
  provideAppInitializer,
  provideExperimentalZonelessChangeDetection
} from "@angular/core";
import {provideAnimationsAsync} from "@angular/platform-browser/animations/async";
import {provideRouter, withComponentInputBinding, withRouterConfig} from "@angular/router";
import {providePrimeNG} from "primeng/config";
import {routes} from "./app.routes";
import {authInterceptor} from "../interceptor/auth.interceptor";
import {AuthService} from "../service/auth.service";
import {ThemePreset} from './theme.preset';
import {ThemeService} from '../service/theme.service';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {StaticTranslateLoader} from '../i18n/static.translate-loader';
import {LanguageService} from '../service/language.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAppInitializer(() => {
      inject(ThemeService);
      inject(LanguageService);
      inject(AuthService);
    }),
    provideExperimentalZonelessChangeDetection(),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withRouterConfig({ paramsInheritanceStrategy: 'always' })
    ),
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor])
    ),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: ThemePreset,
        options: {
          darkModeSelector: '.dark'
        }
      }
    }),
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: StaticTranslateLoader
        }
      })
    )
  ]
};
