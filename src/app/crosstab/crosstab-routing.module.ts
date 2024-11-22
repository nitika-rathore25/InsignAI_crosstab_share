import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CrosstabComponent } from './crosstab.component';
import { EditBannerComponent } from './edit-banner/edit-banner.component';
import { EditTableListComponent } from './edit-table-list/edit-table-list.component';

const routes: Routes = [
  { path: '', component: CrosstabComponent, },
  { path: 'edit-banner', component: EditBannerComponent },
  { path: 'table-list', component: EditTableListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CrosstabRoutingModule { }

