import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GuiComponentsModule } from 'ui-lib/src/components';
import { ComponentsModule } from './components.module';

@NgModule({
  exports: [
    CommonModule,
    GuiComponentsModule,
    ComponentsModule,
  ]
})
export class BaseModule {

}
