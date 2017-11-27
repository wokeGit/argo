import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { WorkflowsService } from './workflows.service';
import { ModalService } from './modal.service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
  ],
  declarations: [],
  providers: [
    WorkflowsService,
    ModalService,
  ]
})
export class ServicesModule { }
