import { NgModule } from '@angular/core';

import { GuiComponentsModule } from 'ui-lib/src/components';
import { ComponentsModule } from './components.module';

@NgModule({
  exports: [
    GuiComponentsModule,
    ComponentsModule,
  ]
})
export class BaseModule {

}
