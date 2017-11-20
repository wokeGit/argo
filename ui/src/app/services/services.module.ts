import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { WorkflowsService } from './workflows.service';
import { ViewPreferencesService } from './view-preferences.service';
import { AuthenticationService } from './authentication.service';
import { CookieService } from './cookie.service';
import { UsersService } from './users.service';
import { TrackingService } from './tracking.service';
import { SystemService } from './system.service';
import { BranchService } from './branch.service';
import { RepoService } from './repo.service';
import { ToolService } from './tool.service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
  ],
  declarations: [],
  providers: [
    WorkflowsService,
    ViewPreferencesService,
    AuthenticationService,
    CookieService,
    UsersService,
    TrackingService,
    SystemService,
    BranchService,
    RepoService,
    ToolService
  ]
})
export class ServicesModule { }
