import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ServeresponsePageRoutingModule } from './serveresponse-routing.module';

import { ServeresponsePage } from './serveresponse.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ServeresponsePageRoutingModule
  ],
  declarations: [ServeresponsePage]
})
export class ServeresponsePageModule {}
