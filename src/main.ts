import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { LicenseManager } from 'ag-grid-enterprise';

if (environment.production) {
    enableProdMode();
}
LicenseManager.setLicenseKey(
    '[PROD][v2]-01_May_2030__MTkwMzgyNDAwMDAwMA==a40b3d7226d24f6509736682beab6bc2'
);
platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.error(err));
