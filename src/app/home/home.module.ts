import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { PipesModule } from '../pipes/pipes.module';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    PipesModule,
    FontAwesomeModule
    
  ],
 

  
  declarations: [HomePage]
})
export class HomePageModule {}
