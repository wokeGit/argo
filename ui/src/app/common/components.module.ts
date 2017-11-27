import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DurationPipe } from './duration.pipe';
import { TimestampPipe } from './timestamp.pipe';
import { WorkflowStatusPipe } from './workflow-status.pipe';
import { LoaderListMockupComponent } from './loader-list-mockup/loader-list-mockup.component';
import { ModalComponent } from './modal/modal.component';
import { ModalTemplateComponent } from './modal/modal.template';

const components = [
  DurationPipe,
  TimestampPipe,
  WorkflowStatusPipe,
  LoaderListMockupComponent,
  ModalComponent,
  ModalTemplateComponent,
];

@NgModule({
  declarations: components,
  exports: components,
  imports: [
    CommonModule
  ]
})
export class ComponentsModule {}
