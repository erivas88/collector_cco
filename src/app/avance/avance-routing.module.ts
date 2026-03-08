import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AvancePage } from './avance.page';

const routes: Routes = [
  {
    path: '',
    component: AvancePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AvancePageRoutingModule {}
