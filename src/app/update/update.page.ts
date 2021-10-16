import { Component, OnInit } from '@angular/core';
import { DatabaseService , Dev } from '../services/database.service';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import { NavController, LoadingController, AlertController, ToastController } from '@ionic/angular';
import { HttpClient,HttpParams, HttpHeaders } from '@angular/common/http';
import { DNS } from '@ionic-native/dns/ngx';




@Component({
  selector: 'app-home',
  templateUrl: 'update.page.html',
  styleUrls: ['update.page.scss'],
})


export class UpdatePage implements OnInit {

  developers: Dev[] = []; 
  products: Observable<any[]>; 
  estaciones:Observable<any[]>; 
  programas : Observable<any[]>; 
  monitoreos : Observable<any[]>; 
  monitoreospp :any[] = []; 
  equipos_caudal  : Observable<any[]>;
  equipos_nivel :  Observable<any[]>;
  equipos_multiparametro:  Observable<any[]>;
  developer = {};
  product = {};
  textoBuscar: string = '';
  total  : any;
  estatus = {'dns':'','class':'','icon':''};
  masterkey ='gp262020';

  constructor(private db: DatabaseService,
    public alertController: AlertController,
    public loadingController: LoadingController,
    private router: Router, 
    public actionSheetController: ActionSheetController,
    private toastController: ToastController,
    private dns: DNS,
   
   ) { }

  ngOnInit() {

    this.resolveDNS();
   

    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.db.getDevs().subscribe(devs => {
          this.developers = devs;
        })     
        
        this.db.getActulizaciones().subscribe((data) => {
          this.monitoreospp= data;
        }, (err) => {
        console.log(err);
        });

      }
      
    });


  /*  this.monitoreospp = [
      { id:'1',
        estacion: 'Drop Box 0',
        fecha_medicion: '01-01-2021',
        hora_medicion : '22:22:22',       
        isChecked:false
        }, { id:'2',
        estacion: 'Drop Box 1',
        fecha_medicion: '01-01-2021',
        hora_medicion : '22:22:22',       
        isChecked:false
        }, { id:'3',
       estacion: 'Drop Box 2',
       fecha_medicion: '01-01-2021',
       hora_medicion : '22:22:22',       
       isChecked:false
       }, { id:'4',
       estacion: 'Drop Box 3',
       fecha_medicion: '01-01-2021',
       hora_medicion : '22:22:22',       
       isChecked:false
       }, { id:'5',
       estacion: 'Drop Box 4',
       fecha_medicion: '01-01-2021',
       hora_medicion : '22:22:22',       
       isChecked:false
       }, { id:'6',
       estacion: 'Drop Box ',
       fecha_medicion: '01-01-2021',
       hora_medicion : '22:22:22',       
       isChecked:false
      },{ id:'1',
      estacion: 'Drop Box 0',
      fecha_medicion: '01-01-2021',
      hora_medicion : '22:22:22',       
      isChecked:false
      }, { id:'2',
      estacion: 'Drop Box 1',
      fecha_medicion: '01-01-2021',
      hora_medicion : '22:22:22',       
      isChecked:false
      }, { id:'3',
     estacion: 'Drop Box 2',
     fecha_medicion: '01-01-2021',
     hora_medicion : '22:22:22',       
     isChecked:false
     }, { id:'4',
     estacion: 'Drop Box 3',
     fecha_medicion: '01-01-2021',
     hora_medicion : '22:22:22',       
     isChecked:false
     }, { id:'5',
     estacion: 'Drop Box 4',
     fecha_medicion: '01-01-2021',
     hora_medicion : '22:22:22',       
     isChecked:false
     }, { id:'6',
     estacion: 'Drop Box ',
     fecha_medicion: '01-01-2021',
     hora_medicion : '22:22:22',       
     isChecked:false
    }];*/
      this.total =  this.monitoreospp.length;
     
   
  }
  ionViewDidEnter() { 

    this.resolveDNS();

    console.log("ionViewDidEnter"); 
    
    console.log(this.estatus);
   // this.resolveDNS();

   /*  this.db.getDatabaseState().subscribe(rdy => {
     if (rdy) {
       this.db.getDevs().subscribe(devs => {
         this.developers = devs;
       })    

       this.db.loadUpdates(); 
       
       this.db.getActulizaciones().subscribe((data) => {
         this.monitoreospp= data;
         console.log('act:',data)
       }, (err) => {
       console.log(err);
       });

     }
     
   });*/

  
  }


  resolveDNS()
{
  let msj = '';
  console.log('Resolving DNS');
  let hostname='www.gpconsultores.cl';
  this.dns.resolve(hostname)
  .then(
    address => this.SuccesmessageDNS(),
    error => this.ErrormessageDNS(),
  );
}
async SuccesmessageDNS() { 

  this.estatus.class='success';
  this.estatus.dns='ok';
  this.estatus.icon='checkmark-outline';

  const toast = await this.toastController.create({
    message: 'Acceso a servidor verificado',
    duration: 2000
  });
  toast.present();
 
}

async ErrormessageDNS() {

  this.estatus.class='danger';
  this.estatus.dns='ok';
  this.estatus.icon='close-outline';

  const toast = await this.toastController.create({
    message: 'No se pudo establer acceso a servidor',
    duration: 2000,
    color: 'danger'
  });
  toast.present();
 

  
}
  onsearchChange(event)
  {
    console.log(event)
    this.textoBuscar =event.detail.value ;
  }
  doRefresh(event) {


    this.resolveDNS();
    this.db.getDatabaseState().subscribe(rdy => {
     if (rdy) {
       this.db.getDevs().subscribe(devs => {
         this.developers = devs;
       })    

       this.db.loadUpdates(); 
       
       this.db.getActulizaciones().subscribe((data) => {
         this.monitoreospp= data;
         console.log('act:',data)
       }, (err) => {
       console.log(err);
       });

     }
     
   });

    
    event.target.complete();    

  }
  delete(id){

    
    this.db.deleteHistorico(id);

  }
  editinfo(id)
  {
    this.router.navigate(['/monitoreo'],{ queryParams: { id: id } });
  }

  
  async presentAlertConfirm(nombre) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Borrar Datos',
      message: '¿Desea eliminar el histórico de '+nombre+'?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Ok',
          handler: () => {
            console.log('Confirm Okay');
            this.deleteAlertPrompt(nombre);
           // this.delete(nombre);
            

          }
        }
      ]
    });
    await alert.present();
  }

  async deleteAlertPrompt(nombre){

    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Esta acción requiere ingreso de contraseña ',
      inputs: [
        
        {
          name: 'password',
          type: 'password',
          placeholder: 'ingrese contraseña',
          cssClass: 'specialClass',
          attributes: {
            maxlength: 8,
            inputmode: 'decimal'
          }
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            console.log('Confirm Ok');
            console.log(data.password);
            this.deleteValidAll(nombre,data.password);
          }
        }
      ]
    });

    await alert.present();
  }


  async delAlertPrompt(){

    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Esta acción requiere ingreso de contraseña ',
      inputs: [
        
        {
          name: 'password',
          type: 'password',
          placeholder: 'ingrese contraseña',
          cssClass: 'specialClass',
          attributes: {
            maxlength: 8,
            inputmode: 'decimal'
          }
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            console.log('Confirm Ok');
            console.log(data.password);
            this.deleteValid(data.password);
          }
        }
      ]
    });

    await alert.present();
  }

  deleteValid(password)
  {
      if(this.masterkey == password)
      {
              
        this.deleteSuccess();

         console.log('Confirm Okay');
            this.db.deleteallHistorico();
            this.db.loadUpdates();   
            
            this.db.getActulizaciones().subscribe((data) => {
              this.monitoreospp= data;
            }, (err) => {
            console.log(err);
            });
       
      }
      else{
    
        this.deleteError();
      }
  }




  deleteValidAll(nombre,password)
  {
      if(this.masterkey == password)
      {
        this.deleteSuccess();       
        this.delete(nombre);
      }
      else
      {
         this.deleteError();
      }
  }
  async deleteSuccess() {
    const toast = await this.toastController.create({
      message: 'Password verificado',
      duration: 2000,
      color: 'success'
    });
    toast.present();
  }

  async deleteError() {
    const toast = await this.toastController.create({
      message: 'Comrpruebe su password. Error al eliminar ',
      duration: 2000,
      color: 'danger'
    });
    toast.present();
  }

  async presentAlertDelete() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Borrar Monitoreos',
      message: '¿Desea eliminar el históric de datos almacenados localmente?',
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

            this.delAlertPrompt();
            /*
            console.log('Confirm Okay');
            this.db.deleteallHistorico();
            this.db.loadUpdates();   
            
            this.db.getActulizaciones().subscribe((data) => {
              this.monitoreospp= data;
            }, (err) => {
            console.log(err);
            });*/
           
          }
        }
      ]
    });
    await alert.present();
  }

  
  async presentActionSheet() {
  const actionSheet = await this.actionSheetController.create({
    header: 'Opciones',
    cssClass: 'my-custom-class',
    buttons: [{
      text: 'Eliminar Monitoreos',
      role: 'destructive',
      icon: 'trash-outline',
      handler: () => {
        console.log('Delete clicked');
        this.presentAlertDelete();
       
      }
    },{
      text: 'Cerrar Sesión',
      icon: 'log-out-outline',
     
      handler: () => {
        console.log('Cancel clicked');
      }
    },{
      text: 'Cancelar',
      icon: 'close',
      role: 'cancel',
      handler: () => {
        console.log('Cancel clicked');
      }
    },
    ]
  });
  await actionSheet.present();
}
  
  

}
