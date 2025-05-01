import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';


bootstrapApplication(AppComponent, {
  providers: [provideHttpClient()] // execute; sets up an http provider; Angular now knows how to inject an http client service
}).catch((err) => console.error(err));
