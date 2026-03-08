import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HistoricDataPageRoutingModule } from './historic-data-routing.module';
import { HistoricDataPage } from './historic-data.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HistoricDataPageRoutingModule
  ],
  declarations: [HistoricDataPage]
})
export class HistoricDataPageModule {}
