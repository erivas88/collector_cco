import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SendataPageRoutingModule } from './sendata-routing.module';

import { SendataPage } from './sendata.page';
import { PipesModule } from '../pipes/pipes.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SendataPageRoutingModule,
    PipesModule
  ],
  declarations: [SendataPage]
})
export class SendataPageModule {}
