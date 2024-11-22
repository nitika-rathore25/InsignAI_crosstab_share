import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{
  path: '',
  loadChildren: () =>
    import('./crosstab/crosstab.module').then((m) => m.CrosstabModule),
  data: { title: 'Insights Curry: Project Crosstab' }
},];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
