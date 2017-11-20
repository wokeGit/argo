import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/bufferCount';

import { AppRoutingModule } from './app-routing.module';
import { LayoutModule } from './layout/layout.module';
import { ComponentsModule } from './common/components.module';

import { AppComponent } from './app.component';
import { ViewPreferencesService } from './services/view-preferences.service';
import { AuthenticationService } from './services/authentication.service';
import { CookieService } from './services/cookie.service';
import { UsersService } from './services/users.service';
import { TrackingService } from './services/tracking.service';
import { SystemService } from './services/system.service';
import { BranchService } from './services/branch.service';
import { RepoService } from './services/repo.service';
import { ToolService } from './services/tool.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LayoutModule,
    ComponentsModule,
    HttpModule
  ],
  providers: [
    ViewPreferencesService,
    AuthenticationService,
    CookieService,
    UsersService,
    TrackingService,
    SystemService,
    BranchService,
    RepoService,
    ToolService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
