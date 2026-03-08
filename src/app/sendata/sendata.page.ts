import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { DatabaseService , Dev } from '../services/database.service';
import { HttpClient,HttpParams, HttpHeaders } from '@angular/common/http';
import { NavController, LoadingController, AlertController, ToastController } from '@ionic/angular';
import { ActionSheetController } from '@ionic/angular';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { DNS } from '@ionic-native/dns/ngx';


@Component({
  selector: 'app-sendata',
  templateUrl: './sendata.page.html',
  styleUrls: ['./sendata.page.scss'],
})
export class SendataPage implements OnInit {

  isIndeterminate:boolean;
  masterCheck:boolean;
 // checkBoxList:any;
  selectedView = 'toSend';
  sentdata : any[] = []; 
  checkBoxList :any[] = []; 
  ServerResponse : any;
  ServerData : any;
  textoBuscar: string = '';
  textoBuscarMirror: string = '';
  updatingData : any[];

  estatus = {'dns':'','class':'','icon':''};


  ios: boolean;
  dayIndex = 0;
  queryText = '';
  segment = 'all';
  excludeTracks: any = [];
  shownSessions: any = [];
  groups: any = [];
  confDate: string;
  showSearchbar: boolean;
  start;
  end: any;
  mydata: any = [];
 // mydata.push(this.checkBoxList[i]);

  public form = [
    { val: 'Pepperoni', isChecked: true },
    { val: 'Sausage', isChecked: false },
    { val: 'Mushroom', isChecked: false }
  ];

  constructor(private db: DatabaseService,
              private http: HttpClient,
              public navCtrl: NavController,
              public loading: LoadingController,
              public alertController: AlertController,
              public actionSheetController: ActionSheetController,
              private router: Router,
              private dns: DNS,
              private toastController: ToastController ) { }

  ngOnInit() {

 

  this.db.getDatabaseState().subscribe(rdy => {
    
      if (rdy) {
        this.db.getDevs().subscribe(devs => {
         //this.developers = devs;
        })
        //this.monitoreos = this.db.getMonitoreos();   
        
        this.db.getPending().subscribe((data) => {
          this.checkBoxList= data;
        }, (err) => {
        console.log(err);
        });

        this.db.getSending().subscribe((data) => {
          this.sentdata= data;
        }, (err) => {
        console.log(err);
        });

      }
    
    });
    

   
  }

  ionViewWillEnter()
  {
     console.log(":O"); 
    
     console.log(this.estatus);
     this.resolveDNS();
     this.orderbydate();
  }
  loadData(event) {
    let i;
    setTimeout(() => {
      console.log('Done');


      event.target.complete();

      for( i=this.start;i<8;i++)
      {
        this.mydata.push(this.checkBoxList[i]);
     
      }
      this.start = i;
      console.log(this.start)

       

      // App logic to determine if all data is loaded
      // and disable the infinite scroll
     /* if (data.length == 1000) {
        event.target.disabled = true;
      }*/
    }, 500);
    console.log(this.mydata)
  }
  orderbydate()
  {
   this.checkBoxList.sort(this.sortFunction);
   this.sentdata.sort(this.sortFunction);
  }

  sortFunction(a,b){  

    var dateA = new Date(a.fecha_medicion+" "+a.hora_medicion).getTime();
    var dateB = new Date(b.fecha_medicion+" "+b.hora_medicion).getTime();
    return dateA < dateB ? 1 : -1;  

};  
  onsearchChange(event)
  {
    console.log(event)
    this.textoBuscar =event.detail.value ;
  }

  onsearchChangeMirror(event)
  {
    console.log(event)
    this.textoBuscarMirror=event.detail.value ;
  }

  checkMaster() {
    setTimeout(()=>{
      this.checkBoxList.forEach(obj => {
        obj.isChecked = this.masterCheck;
      });
    });
  }

  

  checkEvent() {
    const totalItems = this.checkBoxList.length;
    let checked = 0;
    this.checkBoxList.map(obj => {
      if (obj.isChecked) checked++;
    });
    if (checked > 0 && checked < totalItems) {
      //If even one item is checked but not all
      this.isIndeterminate = true;
      this.masterCheck = false;
    } else if (checked == totalItems) {
      //If all are checked
      this.masterCheck = true;
      this.isIndeterminate = false;
    } else {
      //If none is checked
      this.isIndeterminate = false;
      this.masterCheck = false;
    }
  }
  async collectData(){   

    

    const load = await this.loading.create({
      cssClass: 'my-custom-class',
      message: 'Enviando datos...',
      spinner: 'bubbles',
      translucent: true,
    });
    let i=0;
    let data = this.checkBoxList;
    let dataSend =[]; 
    for (let entry of data){
      if(entry.isChecked==true)
      {      
        dataSend.push(entry);
       // this.db.updateMonitoreo(entry.id);
        
      }   
  }
  console.log(dataSend.length);
  if(dataSend.length==0)
  {
    this.presentAlert(); 
  }
  else{

    //let mobiledata = JSON.stringify(dataSend);
    let mobiledata = dataSend;
    let respuesta, updates ;
    console.log(mobiledata);
    load.present().then(() => { 
    this.http.post('https://www.gpconsultores.cl/apicollector/process.php', {mobiledata}, {responseType: 'json'} ).subscribe(data => {
        console.log(data);  
        this.ServerResponse = data; 
        respuesta = data;
        this.updatingData= respuesta.response;
        updates = respuesta.response;
        console.log("reply->",respuesta.response);
        this.UpdateDataServer(respuesta.response);    
        console.log(updates)
        this.ServerMessage(respuesta);
        load.dismiss();
       },  (error) => {                              //Error callback
        console.error('Callback Error');
        load.dismiss();
        this.presentError(error.message);
      });
    });
    this.db.loadMonitoreos();
    this.db.loadMonitoreoPending();
    this.db.loadMonitoreoSending();
    //this.router.navigate(['/sendata']);
    //console.log(this.ServerResponse);
     //this.UpdateDataServer(this.updatingData);
  }

}

async presentError(message) {
  const alert = await this.alertController.create({
    header: 'Error',
    message: message,
    buttons: ['OK']
  });

  await alert.present();
}

UpdateDataServer(data)
{
    console.log("outside ");
    for (let entry of data){      
      this.db.updateResponseServer(entry);
    }
}

async presentAlert() {
  const alert = await this.alertController.create({
  
    header: ' Error',
    subHeader: '',
    message: ' No ha Seleccionado datos para enviar al servidor.',
    buttons: ['OK']
  });

  await alert.present();
}

async ServerMessage(servermessage) {
  const cantidadInsertada = servermessage.insertados;
  let mensaje;
  
  if (cantidadInsertada === 0) {
      mensaje = 'Ninguna muestra fue ingresada, Verifique logs en servidor';
  } else {
      mensaje = cantidadInsertada > 1 ? ` muestras ingresadas` : ' muestra ingresada';
  }
  
  console.log(cantidadInsertada);
  console.log(mensaje);  

  /*const alert = await this.alertController.create({
    header: 'Respuesta',
    subHeader: '',
    message: `${cantidadInsertada} ${mensaje}`,
    buttons: [
      {
        text: 'Ok',
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => {
          console.log('Confirm Ok');
        }
      }
    ]
  });*/

  const alert = await this.alertController.create({
    header: 'Respuesta',
    subHeader: '',
    message: `
      <ion-icon name="information-circle" color="primary" size="large"></ion-icon>
      ${cantidadInsertada} ${mensaje}
    `,
    buttons: [
      {
        text: 'Ok',
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => {
          console.log('Confirm Ok');
        }
      }
    ]
  });

  await alert.present();
}


async ErrormessageDNS() {

  this.estatus.class='danger';
  this.estatus.dns='error';
  this.estatus.icon='close-outline';
 

  const alert = await this.alertController.create({
  
 
    header: 'Conexión a servidor',
    subHeader: '',
    message: 'No se ha logrado establecer conexión con servidor.',
    buttons: [
     {
        text: 'Ok',
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => {
          console.log('Confirm Ok');
          
        }
      }
    ]
  });
  
  await alert.present();
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

async presentActionSheet() {

if(this.estatus.dns=='ok')
{

  const actionSheet = await this.actionSheetController.create({
    header: 'Opciones',
    cssClass: 'my-custom-class',
    buttons: [{
      text: 'Enviar datos a servidor',
      role: 'destructive',
      icon: 'server-outline',
      handler: () => {
        console.log('Delete clicked');
        this.collectData();
      }
    }, {
    
      text: 'Verificar conexion con servidor',
      icon: 'git-compare-outline',
      handler: () => {
        console.log('Share clicked');
        this.resolveDNS();
      }
    },{
      text: 'Cerrar Sesión',
      icon: 'log-out-outline',
     
      handler: () => {
        console.log('Cancel clicked');
      }
    }, {
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
if(this.estatus.dns=='error')
{
 this.withoutConexion();
}

  
}
seeMore(id){
  this.router.navigate(['/serveresponse'],{ queryParams: { id: id } });
 
}
handleClick(){
  console.log(1);
}

async withoutConexion() {
  const alert = await this.alertController.create({
    cssClass: 'my-custom-class',
    header: 'Error',
    subHeader: '',
    message: 'Verifica tu conexion con el servidor',
    buttons: ['OK']
  });

  await alert.present();
}




}
