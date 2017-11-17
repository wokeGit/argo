import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import {
    SlidingPanelComponent, SlidingPanelHeaderDirective,
    SlidingPanelBodyDirective, SlidingPanelFooterDirective,
} from './sliding-panel/sliding-panel.component';
import { SlidingPanelService } from './sliding-panel/sliding-panel.service';
import { SwipeCheckboxComponent } from './swipe-checkbox/swipe-checkbox.component';
import { LoaderCustomComponent } from './loader-custom/loader-custom.component';

let components = [
    SlidingPanelComponent,
    SlidingPanelHeaderDirective,
    SlidingPanelBodyDirective,
    SlidingPanelFooterDirective,
    SwipeCheckboxComponent,
    LoaderCustomComponent
];

@NgModule({
    declarations: components,
    // entryComponents: [TooltipContentComponent],
    // exports: components.concat(NotificationsModule),
    providers: [{
        provide: SlidingPanelService,
        useFactory: () => SlidingPanelService.create(),
    },
      // {
        // provide: PopupService,
        // useFactory: () => PopupService.create(),
    // }
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
    ],
})
export class GuiComponentsModule {
}
