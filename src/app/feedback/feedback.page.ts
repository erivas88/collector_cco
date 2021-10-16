import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseService , Dev } from '../services/database.service';
import { NavController, LoadingController, AlertController, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { HttpClient,HttpParams, HttpHeaders } from '@angular/common/http';
import { DNS } from '@ionic-native/dns/ngx';


@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.page.html',
  styleUrls: ['./feedback.page.scss'],
})
export class FeedbackPage implements OnInit {

  developers: Dev[] = []; 
  products: Observable<any[]>; 
  ultima :Observable<any[]>;
  developer = {};
  product = {};
  id_estacion : any;  
  programas : Observable<any[]>; 
  selectedView = 'devs';
  estatus = {'dns':'','class':'','icon':''};
  textToDisplay:string='';
  estaciones:Observable<any[]>;
  estaciones_array:any[];
  selectAll: true;
  id_programa_act='';
 
  constructor(private db: DatabaseService,
    private http: HttpClient,
    public loadingController: LoadingController,
     private toastController: ToastController,
     private dns: DNS,
     public alertController: AlertController,) { }
 
  ngOnInit() {
    this.resolveDNS();
    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.db.getDevs().subscribe(devs => {
          this.developers = devs;
        })
        this.products = this.db.getProducts();
        this.estaciones = this.db.getStations();
        this.programas = this.db.getProgramas(); 
        this.db.getStations().subscribe(devs => {
          this.estaciones_array = devs;
        })
      }
    });
  }
  ionViewWillEnter()
  {
     console.log(":O"); 
    
     console.log(this.estatus);
     this.resolveDNS();
  }
  async locationSucess() { 
  

    const toast = await this.toastController.create({
      message: 'Ubicación Obtenida',
      duration: 2000
    });
    toast.present();
   
  }

  doRefresh(event) {


    this.db.getDatabaseState().subscribe(rdy => {


      if (rdy) { 

        
    this.db.loadStations();
    this.updatePrograms();
    this.programas = this.db.getProgramas(); 
    event.target.complete();   
    this.MessageToast('Updating...','dark') 
        
      }
      else
      {
        event.target.complete();   
        this.MessageToast('No se pudo establecer conexion a la base de datos...','danger') 
        
      }


    });


   

  }
  

  uncheck(event)
  {
    console.log(event.detail.checked)

    let eventReceived =event.detail.checked;  

    if(eventReceived==true)
    {
          this.id_estacion=[];
       // this.id_estacion=['LM-21'];

       console.log(this.estaciones_array);

       for(let entry of this.estaciones_array)
       {
         this.id_estacion.push(entry.name);
       }

    }
    else
    {
      this.id_estacion=[];
    }
  }

  onSelectChange(selectedValue: any) {
    this.textToDisplay = "("+this.id_estacion.length+")" ;

    console.log('text',this.textToDisplay);

  }

  async presentAlerterror() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Error',
      subHeader: '',
      message: 'Seleccione una estacion para importar datos.',    
      buttons: ['OK']
    });

    await alert.present();
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


async dataSavedResolved() {
  const toast = await this.toastController.create({
    message: 'Histórico actualizado',
    duration: 2000,
    color : 'primary'
  });
  toast.present();
}


async saveDataConfirm() {
  let msg;

  if(this.id_estacion.length==1){

    msg = '¿Actualizar histórico en '+this.id_estacion+ '  ?';
  }
  if(this.id_estacion.length>1)
  {
    msg = '¿Actualizar histórico en '+this.id_estacion.length+ ' estaciones ?';
  }
  const alert = await this.alertController.create({
    cssClass: 'my-custom-class',
    header: 'Descarga de Datos',
    message: msg,
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
          this.savingData(this.id_estacion);
        }
      }
    ]
  });

  await alert.present();
}





  async getEstacionId()
{

 

  if(this.estatus.dns=='error'){

    this.ErrormessageDNS();

  }
  else
  {
    if(this.id_estacion==undefined)
    {
     console.log('error');
     this.presentAlerterror()
    }
    else
    {
       this.saveDataConfirm();   
    }

  }

 

  
 
}
  async savingData(estaciones)
{ let response;
  const loading = await this.loadingController.create({
    cssClass: 'my-custom-class',
    message: 'Descargando desde servidor...',
    spinner: 'bubbles',
  
  });
  loading.present().then(() => { 


    for(let entry of estaciones){

      console.log('estacion->',entry)

      this.http.post('https://www.gpconsultores.cl/api_rest/get_new_data.php', {entry}, {responseType: 'json'} ).subscribe(data => {
        console.log(data);        
        this.processData(data); 
     
      }, (error) => {  
        loading.dismiss();                            //Error callback
        alert('Ocurrio un error');
       
      });

    }
     loading.dismiss();
    this.dataSavedResolved();

  

  }); 

}
async dataEmpty()
{

  const alert = await this.alertController.create({
    cssClass: 'my-custom-class',
    header: 'Sin datos',
    message: 'No se puede actualizar histórico.',
    buttons: [
      {
        text: 'Aceptar',
        role: 'cancel',
        cssClass: 'secondary',
        handler: (blah) => {
          console.log('Confirm Cancel: blah');
        }
      }
    ]
  });

  await alert.present();

}
processData(data)
{

     let respuestaServer = data;
     console.log(respuestaServer.data);
     if(respuestaServer.data==null)
     {
       //this.dataEmpty();
       console.log('empty');

     }
     else
     {      

        for(let entry of respuestaServer.data)
        {  
          this.db.addHistorico(entry.fecha,entry.certificado,entry.estacion,entry.nivel,entry.caudal,entry.ph,entry.temperatura,entry.conductividad,entry.oxigeno,entry.turbiedad,entry.SDT);
         //addHistorico(fecha,estacion,valor_nivel,valor_caudal,valor_ph,valor_temperatura,valor_conductividad,valor_oxigeno,valor_turbiedad,valor_sdt)
        }
       // loading.dismiss();  
       this.db.loadUpdates();      

     }     

}
 async httpStations()
{

  const loading = await this.loadingController.create({
    cssClass: 'my-custom-class',
    message: 'Descargando desde servidor...',
    spinner: 'bubbles',
  
  });

 
  if(this.estatus.dns=='error'){
 
    this.ErrormessageDNS();
     
  }
  else
  {

    loading.present().then(() => { 

    console.log('init http');
    this.http.post('https://www.gpconsultores.cl/api_rest/get_staciones_monitoreo_app.php', {responseType: 'json'} ).subscribe(data => {
      console.log(data);        
      this.processEstaciones(data)
   
    });


    loading.dismiss();
    this.db.loadStations();
    this.MessageToast('Estaciones Actualizadas','dark');


    });

  }
}
processEstaciones(data)
{
  for(let entry of data)
  {
    console.log(entry.estacion, entry.id_estacion);
    this.db.addEstaciones(entry.estacion,entry.id_estacion);
  }

}

processPrograma(data)
{
  for(let entry of data)
  {
   console.log(entry);

   this.db.addPrograma(entry.programa,entry.id)
  
  }

}

processProgramaMonitoreo(data){
 
  for(let entry of data)
  {
     
    this.db.addProgramaMonitoreo(entry.uniq_id,entry.programa,entry.id_estacion,entry.nivel_programa,entry.caudal_programa,entry.ph_programa,entry.temperatura, entry.conductividad_programa,entry.oxigeno_programa,entry.turbiedad_programa,entry.sdt_programa);
     console.log("insert->",entry)
  }

}
async MessageToast(msg,color) {
  const toast = await this.toastController.create({
    message: msg,
    duration: 2000,
    color : color
  });
  toast.present();
} 
  addDeveloper() {
    let skills = this.developer['skills'].split(',');
    skills = skills.map(skill => skill.trim());
 
    this.db.addDeveloper(this.developer['name'], skills, this.developer['img'])
    .then(_ => {
      this.developer = {};
    });
  }
 
  addProduct() {
    this.db.addProduct(this.product['name'], this.product['creator'])
    .then(_ => {
      this.product = {};
    });
  }

  async updatePrograms(){

    

    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Descargando desde servidor...',
      spinner: 'bubbles',
    
    });


    if(this.estatus.dns=='error'){
 
      this.ErrormessageDNS();
       
    }
    else
    {

       this.http.post('https://www.gpconsultores.cl/api_rest/get_primary_program.php', {responseType: 'json'} ).subscribe(data => {
        console.log(data);
        this.processPrograma(data);        

    });

      loading.dismiss();


    
    
    
    }


   

  }
 get_programa()
 {
   let url ='https://www.gpconsultores.cl/api_rest/get_programa_app.php';
   let programa =  this.id_programa_act;

    if(programa == undefined)
    {
      console.log("selecciona algun programa");

      this.http.post(url, {responseType: 'json'} ).subscribe(data => {

        this.processProgramaMonitoreo(data);
  

    });
      
    }
    else
    {
      console.log("programa_seleccionado",this.id_programa_act);

        this.http.post(url, {responseType: 'json'} ).subscribe(data => {
          this.processProgramaMonitoreo(data);
            

      });


    }


     
 }

}
