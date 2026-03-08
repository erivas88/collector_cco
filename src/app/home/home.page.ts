import { Component, OnInit } from '@angular/core';
import { DatabaseService , Dev } from '../services/database.service';
import { ExportService } from '../services/export.service';
import { Observable } from 'rxjs';
import { AlertController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ToastController } from '@ionic/angular';




@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})


export class HomePage implements OnInit {

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
  masterkey = 'gp132313';
  users: any[];

  constructor(private db: DatabaseService,
    public alertController: AlertController,
    public loadingController: LoadingController,
    private router: Router, 
    public actionSheetController: ActionSheetController,
    public toastController: ToastController,
    public exp: ExportService
   
   ) { 

    /*setInterval(() => {
     console.log('Hello World'); 
     console.log(this.db.configSend);
     }, 1000);*/
   }

  ngOnInit() {

    this.loadData();
  
    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.db.getDevs().subscribe(devs => {
          this.developers = devs;
        })
        this.monitoreos = this.db.getMonitoreos();   
        
        this.db.getMonitoreos().subscribe((data) => {
          this.monitoreospp= data;
        }, (err) => {
        console.log(err);
        });

      }
      
    });



  
      this.total =  this.monitoreospp.length;
     
   
  }
  loadData() {
   
    this.users = [];
   
  }
  exportToExcel() {
    this.exp.exportToExcel(this.users, 'Users');
    }
  ionViewWillEnter()
  {
    this.orderbydate();
  }
  ionViewDidEnter() {
    
    this.orderbydate();
  }

  async presentAlertPrompt(id) {
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
            this.deleteValid(id,data.password)
          }
        }
      ]
    });

    await alert.present();
  }

  async deleteAlertPrompt(){

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
            this.deleteValidAll(data.password);
          }
        }
      ]
    });

    await alert.present();
  }
  deleteValid(id,password)
  {
      if(this.masterkey == password)
      {
       
        this.delete(id);
        this.deleteSuccess();
      }
      else{
    
        this.deleteError();
      }
  }
  deleteValidAll(password)
  {
      if(this.masterkey == password)
      {
              
        this.deleteSuccess();
        this.db.deleteMonitoreos();  
        this.db.loadMonitoreos();
        this.db.loadMonitoreoPending();
        this.db.loadMonitoreoSending();        
        this.router.navigate(['/']);
      }
      else{
    
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
      message: 'Compruebe el password. Error al eliminar ',
      duration: 2000,
      color: 'danger'
    });
    toast.present();
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Monitoreos ordenados por fecha',
      duration: 2000
    });
    toast.present();
  }

  sortFunction(a,b){  
    var dateA = new Date(a.fecha_medicion+" "+a.hora_medicion).getTime();
    var dateB = new Date(b.fecha_medicion+" "+b.hora_medicion).getTime();
    return dateA < dateB ? 1 : -1;  
}; 
sortalphabetic(a, b)
{
  var textA = a.estacion.toUpperCase();
  var textB = b.estacion.toUpperCase();
  return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;

}
sortdelay(a,b){
	 
	  var a = a.retraso;
      var b = b.retraso;

       return a > b ? 1 : (b > a ? -1 : 0);
}

order(){
  this.orderbydate();
  this.presentToast();
}
  orderbydate()
  {
   this.monitoreospp.sort(this.sortFunction);
  }
  orderbyAlphabetic()
  {
    this.monitoreospp.sort(this.sortalphabetic);
  }
  
  onsearchChange(event)
  {
    console.log(event)
    this.textoBuscar =event.detail.value ;
  }
  doRefresh(event) {

    this.monitoreos = this.db.getMonitoreos();  
   
    this.orderbydate();
    event.target.complete();    

  }
  delete(id){

    this.db.deleteMonitoreo(id);

  }

  showdata(){

    console.log(this.monitoreospp)
   
   
  }



  editinfo(id)
  {
    this.router.navigate(['/monitoreo'],{ queryParams: { id: id } });
  }
  async presentAlertConfirm(id) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Borrar Monitoreo',
      message: '¿Desea Borrar este Monitoreo?',
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
           //this.delete(id);
           this.presentAlertPrompt(id);

          }
        }
      ]
    });
    await alert.present();
  }

  async presentAlertDelete() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Borrar Monitoreos',
      message: '¿Desea borrar todos los datos Almacenados localmente?',
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
            /*
            this.db.deleteMonitoreos();  
            this.db.loadMonitoreos();
            this.db.loadMonitoreoPending();
            this.db.loadMonitoreoSending();        
            this.router.navigate(['/']);*/
            this.deleteAlertPrompt();
          }
        }
      ]
    });

    await alert.present();
  }




  async orderActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Ordenar',
      cssClass: 'my-custom-class',
      buttons: [
     
      {
         text: 'Cancelar',
          role: 'cancel',
          icon: 'close-circle-outline',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel: blah');
          }
        
      }
      
      ]
    });
    await actionSheet.present();
  }

  
  async presentActionSheet() {

  const actionSheet = await this.actionSheetController.create({
    header: 'Opciones',
    cssClass: 'my-custom-class',
    buttons: [{
      text: 'Ordenar por fecha ',
      role: 'destructive',
      icon: 'calendar-outline',
      handler: () => {
     
        this.orderbydate()
       
      }
    },{
      text: 'Ordenar alfabeticamente ',
      role: 'destructive',   
      icon: 'chevron-up-circle-outline',
      handler: () => {
       
         this.orderbyAlphabetic();
       
      }
    },{
      text: 'Eliminar Monitoreos',
      role: 'destructive',
      icon: 'trash-outline',
      handler: () => {
       
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
    ,{
      text: 'Share',
      icon: 'share-social-outline',
      handler: () => {
       this.showdata();
      }
    },
    ]
  });
  await actionSheet.present();
}
  
  

}
