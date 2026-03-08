import { Component, OnInit } from '@angular/core';
import { DatabaseService , Dev } from '../services/database.service';
import { HttpClient,HttpParams, HttpHeaders } from '@angular/common/http';
import { NavController, LoadingController, AlertController, ToastController } from '@ionic/angular';
import { DNS } from '@ionic-native/dns/ngx';

@Component({
  selector: 'app-configs',
  templateUrl: './configs.page.html',
  styleUrls: ['./configs.page.scss'],
})
export class ConfigsPage implements OnInit {

  slides = [
    {
      title: "Welcome to the Docs!",
      description: "The <b>Ionic Component Documentation</b> showcases a number of useful components that are included out of the box with Ionic.",
      image: "assets/img/ica-slidebox-img-1.png",
    },
    {
      title: "What is Ionic?",
      description: "<b>Ionic Framework</b> is an open source SDK that enables developers to build high quality mobile apps with web technologies like HTML, CSS, and JavaScript.",
      image: "assets/img/ica-slidebox-img-2.png",
    },
    {
      title: "What is Ionic Cloud?",
      description: "The <b>Ionic Cloud</b> is a cloud platform for managing and scaling Ionic apps with integrated services like push notifications, native builds, user auth, and live updating.",
      image: "assets/img/ica-slidebox-img-3.png",
    }
  ];

  constructor(private db: DatabaseService,
    public toastController: ToastController,
    private http: HttpClient,
    public navCtrl: NavController,
    public loading: LoadingController,
    private dns: DNS,
    public alertController: AlertController,) {

    setInterval(() => {
      console.log('Hello World'); 
      console.log(this.db.configSend);
      if(this.db.configSend=='false')
      {
        console.log('Envio asincrono no habilitado')
      }
      if(this.db.configSend=='true'){
        console.log('Envio asincrono  habilitado')
        this.sendWhitDNS();
      }
      
      }, 100000);
    
   }
  ServerResponse : any;
  status: any;
  pendingList :any[] = []; 
  updatingData : any[];
  estatus = {'dns':'','class':'','icon':''};

  ngOnInit() {

    console.log('start');
    status = this.db.configSend;    

  }
  ionViewDidEnter() {
    

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

 ErrormessageDNS() {

  this.estatus.class='danger';
  this.estatus.dns='error';
  this.estatus.icon='close-outline';

  /*

  this.
 

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
  
  await alert.present();*/
}

  async presentToast(msg,color) {

    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      color: color
    });
    toast.present();
  }
  change_status(event){


    if(event.detail.checked==false){
     
      this.db.configSend='false';
      console.log('button->',event.detail.checked)
      console.log('serrvice workwer->',this.db.configSend);
      this.presentToast('Disable Asynchronous Mode','danger')

    }else{

      this.db.configSend='true';
      console.log('button->',event.detail.checked)
      console.log('serrvice workwer->',this.db.configSend); 
      this.presentToast('Enable Asynchronous Mode','primary')
    }    
   

  }
  sendWhitDNS()
  {
    this.resolveDNS();
        if(this.estatus.dns=='ok')
        {
            this.processSendData();
        }
        else{
         // this.ErrormessageDNS();
        this.presentToast('No se pudo establecer conexion a servidor','danger');
        }
    
  }
  processSendData()
  { 
    this.filldata();
    if(this.pendingList.length>0)
    {

      let mobiledata = JSON.stringify(this.pendingList);
      let respuesta, updates ;
      console.log(mobiledata);    
      this.onClick(mobiledata);  

    }
    else
    {
      alert (' No hay datos por enviar');
    }
   
  }
  async onClick(mobiledata){

    const load = await this.loading.create({
      cssClass: 'my-custom-class',
      message: 'Enviando datos...',
      spinner: 'bubbles',
      translucent: true,
    });

    let respuesta, updates ;

      console.log(1);
     
     // this.processSendData();
      load.present().then(() => { 
        this.http.post('https://www.gpconsultores.cl/api_rest/insert_new_data.php', {mobiledata}, {responseType: 'json'} ).subscribe(data => {
          console.log(data);  
          this.ServerResponse = data; 
          respuesta = data;
          this.updatingData= respuesta.response;
          updates = respuesta.response;
          console.log(respuesta.response);
          this.UpdateDataServer(respuesta.response);    
          console.log(updates)
          this.ServerMessage(respuesta);
          load.dismiss();
         },  (error) => {                              //Error callback
          console.error('Callback Error');
          load.dismiss();
        });
      });
      this.db.loadMonitoreos();
      this.db.loadMonitoreoPending();
      this.db.loadMonitoreoSending();

  }
  UpdateDataServer(data)
 {
    console.log("outside ");
    for (let entry of data){      
      this.db.updateResponseServer(entry);
    }
}
  filldata()
  {
    this.db.getDatabaseState().subscribe(rdy => {
    
      if (rdy) {       
     
        
        this.db.getPending().subscribe((data) => {
          console.log(data);
          this.pendingList = data;
        }, (err) => {
        console.log(err);
        });     

      }
    
    });
  }

  async ServerMessage(servermessage) {

    console.log(servermessage.insertados)
  
    const alert = await this.alertController.create({
    
   
      header: 'Respuesta',
      subHeader: '',
      message: servermessage.insertados+ " Muestras Ingresadas",
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

}
