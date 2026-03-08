import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {
  
  showSearchbar: boolean;
  selectedView = 'users';
  usuarios :any[] = [];
  datos = {} 
 
  
  constructor( private db: DatabaseService,
               public alertController: AlertController,
               public loadingController: LoadingController) { }

  ngOnInit() {
   
    this.calldb();
   
  }
  calldb()
  {
    
    this.db.getDatabaseState().subscribe(rdy => {

      if (rdy) {

        this.db.getUsuarios().subscribe((data) => {
          this.usuarios= data;
        }, (err) => {
        console.log(err);
        });

      }

     });

  }

  doRefresh(event)
  {
    console.log('Begin async operation');

    /*setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);*/
    
  }

  async eliminarUsuario(id){

    const alert = await this.alertController.create({
      cssClass: 'ion-color-primary ',
      header: 'Borrar Datos',
      message: '¿Desea Eliminar el usuario?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'alertCancel',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Aceptar',
          handler: () => {
            console.log('Confirm Okay');           
            this.db.borrarUsuario(id);
           }
        }
      ]
    });
    await alert.present();

  }
  async deshabilitarUsuario(id)
  {
    const alert = await this.alertController.create({
      cssClass: 'ion-color-primary ',
      header: 'Actualizar Datos',
      message: '¿Desea deshabilitar el usuario?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'alertCancel',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Aceptar',
          handler: () => {
            console.log('Confirm Okay');
            this.db.deshabilitarUsuario(id);           
           // this.db.borrarUsuario(id);
           }
        }
      ]
    });
    await alert.present();

  }
  async habilitarUsuario(id){

    const alert = await this.alertController.create({
      cssClass: 'ion-color-primary ',
      header: 'Actualizar Datos',
      message: '¿Desea habilitar el usuario?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'alertCancel',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Aceptar',
          handler: () => {
            console.log('Confirm Okay');           
           
            this.db.habilitarUsuario(id);
           }
        }
      ]
    });
    await alert.present();

  }
  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Guardar Usuario',
      message: '¿ Desea guardar estos datos? ',
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
      message: 'Guardando...',
      duration: 1500
    });
   
    let nombre = this.datos['nombre'];
    let apellido =this.datos['apellido'];
    let rut = this.datos['rut'];
    let estado = "0";
    console.log(nombre)
    this.db.addUser(nombre,apellido, rut, estado);
    this.reset();
    this.calldb();
    await loading.present();
    this.reset();
  
  }
  reset()
  {
    this.datos['programa']=null;
    this.datos['estacion']=null;
    this.datos['equipo_nivel']=null;
  }

}
