import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ServeresponsePage } from './serveresponse.page';

const routes: Routes = [
  {
    path: '',
    component: ServeresponsePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServeresponsePageRoutingModule {}
