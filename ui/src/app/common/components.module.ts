import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DurationPipe } from './duration.pipe';
import { TimestampPipe } from './timestamp.pipe';
import { ShortTimePipe } from './short-time.pipe';
import { WorkflowStatusPipe } from './workflow-status.pipe';
import { LoaderListMockupComponent } from './loader-list-mockup/loader-list-mockup.component';
import { ModalComponent } from './modal/modal.component';
import { ModalTemplateComponent } from './modal/modal.template';
import { ButtonWaveDirective } from './directives/button-wave/button-wave.directive';
import { HighlightSubstringDirective } from './directives/highlight-substring/highlight-substring.directive';
import { StatusIconDirective } from './status-icon/status-icon.directive';
import { WorkflowTreeComponent } from './workflow-tree/workflow-tree.component';
import { WorkflowSubtreeComponent } from './workflow-tree/workflow-subtree.component';
import { WorkflowTreeNodeComponent } from './workflow-tree/workflow-tree-node.component';

const components = [
  ButtonWaveDirective,
  HighlightSubstringDirective,
  DurationPipe,
  TimestampPipe,
  WorkflowStatusPipe,
  StatusIconDirective,
  ShortTimePipe,
  LoaderListMockupComponent,
  ModalComponent,
  ModalTemplateComponent,
  WorkflowTreeComponent,
  WorkflowSubtreeComponent,
  WorkflowTreeNodeComponent,
];

@NgModule({
  declarations: components,
  exports: components,
  entryComponents: [ModalTemplateComponent],
  imports: [
    CommonModule
  ]
})
export class ComponentsModule {}
