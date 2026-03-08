import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { DNS } from '@ionic-native/dns/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { SQLite } from '@ionic-native/sqlite/ngx';
import { HttpClientModule } from '@angular/common/http';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ConfigsPipe } from './configs.pipe';
import { IonicSelectableModule } from 'ionic-selectable';
import { Camera } from '@ionic-native/camera/ngx';



@NgModule({
  declarations: [AppComponent, ConfigsPipe],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(),  AppRoutingModule,  HttpClientModule,IonicSelectableModule],
  providers: [
    Camera,Geolocation,StatusBar,DNS,
    SplashScreen,BackgroundMode,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    SQLite,
    SQLitePorter
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas, fab, far);
  }
}
