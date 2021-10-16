import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';

@Component({
  
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  navigate : any;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private backgroundMode: BackgroundMode
  ) {
    this.sideMenu();
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
       //this.backgroundMode.enable();
    });
  }
 

  sideMenu()
  {
    this.navigate =
    [
      {
        title : "Monitoreos",
        url   : "/home",
        icon  : "location-outline"
      },
      {
        title : "Registrar Monitoreo",
        url   : "/register",
        icon  : "add-circle-outline"
      },
      {
        title : "Gráficos",
        url   : "/historic-data",
        icon  : "stats-chart-outline"
      },
      
      {
        title : "Enviar datos a Servidor",
        url   : "/sendata",
        icon  : "server-outline"
      },
      {
        title : "Sincronizar",
        url   : "/feedback",        
        icon  : "cloud-download-outline"
      },
       {
        title : "Actualizaciones",
        url   : "/update",
        icon  : "sync-outline",
       
      },
      {
        title : "Config",
        url   : "/configs",
        icon  : "cog-outline",
       
      },

      {
        title : "Cerrar Sesión",
        url   : "/register",
        icon  : "log-out-outline"
      },
    ];
  }
}
