import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'timeline', loadChildren: 'app/+workflows/workflows.module#WorkflowsModule' },
  { path: 'help', loadChildren: 'app/+help/help.module#HelpModule' },
  { path: 'search', loadChildren: 'app/+search/search.module#SearchModule' },
  { path: '',   redirectTo: '/timeline', pathMatch: 'full' },
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
