import { enableProdMode, ViewEncapsulation } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import * as $ from 'jquery';
// import * as yaml from '../node_modules/json2yaml';

window['$'] = $;
window['jQuery'] = $;

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule, [{
  defaultEncapsulation: ViewEncapsulation.None,
}]).catch(err => console.log(err));
