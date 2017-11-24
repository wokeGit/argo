import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SearchComponent } from './search.component';
import { SearchRoutingModule } from './search-routing.module';
import { WorkflowsListComponent } from './workflows-list/workflows-list.component';

export const routes = [
  {path: '', component: SearchComponent, terminal: true},
  {path: ':searchInput', component: SearchComponent, terminal: true},
];

@NgModule({
  declarations: [
    SearchComponent,
    WorkflowsListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SearchRoutingModule
  ]
})
export class SearchModule {
}
