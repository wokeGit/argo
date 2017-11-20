import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { GuiComponentsModule } from '../ui-lib/components.module';

let components: any[] = [
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
