import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AvancePageRoutingModule } from './avance-routing.module';

import { AvancePage } from './avance.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AvancePageRoutingModule
  ],
  declarations: [AvancePage]
})
export class AvancePageModule {}
