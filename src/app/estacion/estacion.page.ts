import { Component, OnInit } from '@angular/core';
import { DatabaseService , Dev } from '../services/database.service';
import { IonicSelectableComponent } from 'ionic-selectable';
import { Observable, from } from 'rxjs';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';

class Port {
  public id: number;
  public name: string;
}

@Component({
  selector: 'app-estacion',
  templateUrl: './estacion.page.html',
  styleUrls: ['./estacion.page.scss'],
})
export class EstacionPage implements OnInit 
{
  register = {};
  selectedView = 'estaciones';
  estaciones :any[] = []; 
  showSearchbar: boolean;
  programas : Observable<any[]>;
  textoBuscar: string = ''; 
 

  constructor(private db: DatabaseService, 
    public toastController: ToastController,
    public alertController: AlertController,
    public modalController: ModalController,
    public loadingController: LoadingController) { }

  ngOnInit()
  {
   
    this.db.loadEstaciones().then(
      (data) => {
        console.log(data);
        this.estaciones = data;
      },
      (err) => {
        console.log(err);
      }
    );


    this.db.getDatabaseState().subscribe(rdy => {
    if(rdy){
       
      
        this.programas = this.db.getProgramas();
       
     

      }
    });

  }
  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Guardar Monitoreo',
      message: '¿ Desea guardar estos datos ? ',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'OK',
          handler: () => {
            console.log('Confirm Okay');
            this.presentLoading();

          }
        }
      ]
    });
    await alert.present();
  }

  async presentLoading() {

    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
      duration: 2000
    });
    let nombre = this.register['estacion'];
    let programa = this.register['programa'];
    this.db.addEstaciones(nombre,programa);
  
    await loading.present();   
  
  
  }
  onsearchChange(event)
  {
    console.log(event)
    this.textoBuscar =event.detail.value ;
  }
  
}

