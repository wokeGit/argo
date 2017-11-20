import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { WorkflowsService } from './workflows.service';
import { WorkflowsServiceService } from './workflows-service.service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
  ],
  declarations: [],
  providers: [
    WorkflowsService,
    WorkflowsServiceService]
})
export class ServicesModule { }
