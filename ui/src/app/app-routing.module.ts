import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from './layout/layout.component';

const routes: Routes = [{
  path: '', loadChildren: 'app/+workflows/workflows.module#WorkflowsModule',
},
  {
    path: 'app',
    component: LayoutComponent,
    children: [
      { path: '', loadChildren: 'app/+workflows/workflows.module#WorkflowsModule' },
    ]
  }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
