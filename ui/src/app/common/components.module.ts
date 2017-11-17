import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { GuiComponentsModule } from '../ui-lib/components.module';

import { GlobalSearchInputComponent } from './global-search-input/global-search-input.component';

let components: any[] = [
    // GlobalSearchInputComponent,
];

@NgModule({
    declarations: components,
    exports: components.concat(GuiComponentsModule),
    imports: [
        GuiComponentsModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
    ],
})
export class ComponentsModule {
}
