import {bootstrapApplication} from '@angular/platform-browser';
import {appConfig} from './constant/app.config';
import {AppComponent} from './page/app/app.component';

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
