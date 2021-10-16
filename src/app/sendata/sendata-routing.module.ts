import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SendataPage } from './sendata.page';

const routes: Routes = [
  {
    path: '',
    component: SendataPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SendataPageRoutingModule {}
