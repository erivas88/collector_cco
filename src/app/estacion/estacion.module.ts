import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EstacionPageRoutingModule } from './estacion-routing.module';

import { EstacionPage } from './estacion.page';
import { IonicSelectableModule } from 'ionic-selectable';
import { PipesModule } from '../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EstacionPageRoutingModule,
    IonicSelectableModule,
    PipesModule 
  ],
  declarations: [EstacionPage]
})
export class EstacionPageModule {}
