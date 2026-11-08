import { registerLocaleData } from '@angular/common';
import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import localePt from '@angular/common/locales/pt';

import { routes } from './app.routes';
import { HttpClientModule } from '@angular/common/http';

registerLocaleData(localePt);

export const appConfig: ApplicationConfig = {
  providers: [importProvidersFrom(HttpClientModule), provideBrowserGlobalErrorListeners(), provideRouter(routes)]

};
