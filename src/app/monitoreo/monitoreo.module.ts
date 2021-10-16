import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MonitoreoPageRoutingModule } from './monitoreo-routing.module';
import { MonitoreoPage } from './monitoreo.page';
import { PipesModule } from '../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MonitoreoPageRoutingModule,
    PipesModule
  ],
  declarations: [MonitoreoPage]
})
export class MonitoreoPageModule {}
