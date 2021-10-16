import { Component, OnInit } from '@angular/core';
import { DatabaseService , Dev } from '../services/database.service';
import { Observable } from 'rxjs';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ChartsPage } from '../charts/charts.page';
import { Geolocation } from '@ionic-native/geolocation/ngx';



@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  latitude: any = 0; //latitude
  longitude: any = 0; //longitude

  developers: Dev[] = []; 
  products: Observable<any[]>; 
  estaciones:Observable<any[]>; 
  ultima :Observable<any[]>;
  programas : Observable<any[]>; 
  equipos_caudal  : Observable<any[]>;
  equipos_nivel :  Observable<any[]>;
  equipos_multiparametro:  Observable<any[]>;
  developer = {};
  quality = {};
  product = {};
  register = {};
  validate_turb = 0;
  validate_color ='primary';
  validate_icon ='chevron-forward';
  arrayCalidad: any;
   registrosDB: any ;

   phQ: any;
   tmQ: any;
   ceQ: any;
   OxQ: any;

   niQ: any;
   caQ: any;
   sdtQ: any;
   tuQ : any;
  

   templateQty = {'ph':{'icon':'chevron-forward','color':'primary','value':'','factor':'','unidad':' u.ph'},
   'conductividad':{'icon':'chevron-forward','color':'primary','value':'','factor':'','unidad':' us/cm'},
   'nivel':{'icon':'chevron-forward','color':'primary','value':'','factor':'','unidad':' m.bnb'},
   'caudal':{'icon':'chevron-forward','color':'primary','value':'','factor':'','unidad':' l/s'},
   'temperatura':{'icon':'chevron-forward','color':'primary','value':'','factor':'','unidad':' °C'},
   'oxigeno':{'icon':'chevron-forward','color':'primary','value':'','factor':'','unidad':' mg/l',},
   'turbiedad':{'icon':'chevron-forward','color':'primary','value':'','factor':'', 'unidad':' NTU'},
   'sdt':{'icon':'chevron-forward','color':'primary','value':'','factor':'','unidad':' mg/l'}};

   options = {
    timeout: 10000, 
    enableHighAccuracy: true, 
    maximumAge: 3600
  };

  


  constructor(
    private geolocation: Geolocation,
    private db: DatabaseService,
    public alertController: AlertController,
    public loadingController: LoadingController,
    private router: Router,
    public modalController: ModalController,
    public toastController: ToastController) { }
      

  ngOnInit() {

    this.validate_turb = 0;
    this.validate_color ='primary';
    this.validate_icon ='chevron-forward';

    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {
       
        this.products = this.db.getProducts();
        this.estaciones = this.db.getStations();
        this.programas = this.db.getProgramas();
        this.equipos_caudal = this.db.getEquipoCaudal();
        this.equipos_nivel = this.db.getEquipoNivel();
        this.equipos_multiparametro = this.db.getEquipoMultiparametro();       

      }
    });
    console.log(this.products);
  }
  async locationSucess() { 

  

    const toast = await this.toastController.create({
      message: 'Ubicación Obtenida',
      duration: 2000,
      color:'primary'
    });
    toast.present();
   
  }


  async locationError() { 

  

    const toast = await this.toastController.create({
      message: 'Falló al obtener ubicación',
      duration: 2000,
      color:'danger'
    });
    toast.present();
   
  }
  
  getCurrentCoordinates() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;
      this.locationSucess();
     }).catch((error) => {
       console.log('Error getting location', error);
       this.latitude  = 'No disponible';
       this.longitude = 'No disponible';
       this.locationError();
     });

     if((this.longitude==0)||(this.longitude==0)){
      this.latitude  = 'No disponible';
      this.longitude = 'No disponible';
       this.locationError();
     }
     
    
  }
  ShowModal()
  {
    alert('modal');
  }
  ionViewWillEnter()
  {
     console.log(":O"); 

     this.getCurrentCoordinates();
    
     console.log(this.templateQty);
  }

  async error(parametro) {
    const toast = await this.toastController.create({
      message: 'Valor de '+parametro+' fuera de limites',
      duration: 2000,
      color:'warning'
    });
    toast.present();
  }


  getHistoric(estacion)
  { 
    this.quality=[];
    this.arrayCalidad =[];
    console.log('estacion->',estacion);
    let ph ;  

    

    console.log(this.db.loadQaqck(estacion.trim())); 

    this.db.loadQaqck(estacion.trim()).then(data => { 

      this.registrosDB = data;

      this.arrayCalidad = data;
     // this.ph = this.registrosDB.valor_ph;
      this.quality['ph']=data.valor_ph;
      this.quality['conductividad']=data.valor_conductividad;   
      this.quality['temperatura']=data.valor_temperatura;
      this.quality['oxigeno']=data.valor_oxigeno;
      this.quality['nivel']=data.valor_nivel;
      this.quality['caudal']=data.valor_caudal;
      this.quality['turbiedad']=data.valor_turbiedad;
      this.quality['sdt']=data.valor_sdt;
      this.quality['estacion']=data.estacion;
      this.quality['fecha']=data.fecha;


      console.log('inside',data);
      this.fill(data);

    })

    console.log('outside',this.arrayCalidad);
    console.log('hola',this.quality);
    console.log('ph',this.quality['ph']);
    console.log('pos 0',this.quality[0]);
    console.log('ph var');

  
   
  

  }
  fill(data)
  {
    


    this.templateQty.ph.value= data.valor_ph;
    this.templateQty.nivel.value = data.valor_nivel;
    this.templateQty.conductividad.value = data.valor_conductividad;
    this.templateQty.caudal.value = data.valor_caudal;
    this.templateQty.temperatura.value = data.valor_temperatura;
    this.templateQty.sdt.value  = data.valor_sdt;
    this.templateQty.oxigeno.value = data.valor_oxigeno;
    this.templateQty.turbiedad.value= data.valor_turbiedad;


    

  }

  
  ionViewDidLeave()
  {
    console.log("Se deja la vista") //se deja la vista 
    let date = new Date();
    console.log(this.convertTime());
    console.log(this.convertDate(date));
    let programa =Number(this.register['programa']);
    let estacion = this.register['estacion'];
    let equipo_caudal = Number(this.register['equipo_caudal']);
    let equipo_nivel = Number(this.register['equipo_nivel']);
    let equipo_multiparametrico = Number(this.register['equipo_multiparametro']);
    let equipo_turbidiometro = Number(this.register['equipo_turbidiometro']);

    this.db.addMonitoreo(programa,estacion.trim(),equipo_nivel,this.register['valor_nivel'],equipo_caudal,this.register['valor_caudal'],equipo_multiparametrico,this.register['valor_temperatura'],this.register['valor_ph'],this.register['valor_conductividad'],this.register['valor_oxigeno'],equipo_turbidiometro,this.register['valor_turbiedad'],this.convertDate(date),this.convertTime(),'false',this.latitude,this.longitude);
    this.reset();
    this.presentToast();

  }
  ionViewWillLeave(){

    console.log(":D") //se dejo 
  }
  
  async openChart(p)
  {
    console.log('1');
    let index = 'valor_'+p;
    let  nivel =  this.register[index];
    let  estacion =this.register['estacion'];
    let   ultimo = this.templateQty[p].value;
    let unidad = this.templateQty[p].unidad;

    /*const modal = await this.modalController.create({
      component: ChartsPage,
      componentProps:{
        value: nivel,
        parametro :p,
        estacion: estacion,
        ultimo: ultimo,
        unidad: unidad         
      },
      cssClass: 'my-custom-class'
    });
    await modal.present();*/

    
  
    if ((nivel==undefined)||(estacion==undefined))
    {
        this.presentAlert();
    }
    else{

      const modal = await this.modalController.create({
        component: ChartsPage,
        componentProps:{
          value: nivel,
          parametro :p,
          estacion: estacion,
          ultimo: ultimo,
          unidad: unidad           
        },
        cssClass: 'my-custom-class'
      });
      await modal.present();

    }
   
  }
  closeModal()
  {
    console.log('exit')
  }
  async presentAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Error',
      subHeader: '',
      message: 'Verifique valor y/o estacion',
      buttons: ['OK']
    });

    await alert.present();
  }
  
 
  addMonitoreo(){
    let date = new Date();
    console.log(this.convertDate(date));
 //  this.db.addMonitoreo(this.register['programa'],this.register['estacion'],this.register['equipo_nivel'],this.register['valor_nivel'],this.register['equipo_caudal'],this.register['valor_caudal'],'28-12-2020','15:08');
  }
  convertDate(date) {

    var yyyy = date.getFullYear().toString();
    var mm = (date.getMonth()+1).toString();
    var dd  = date.getDate().toString();  
    var mmChars = mm.split('');
    var ddChars = dd.split('');  
  
 
      console.log('this is the date')
;     return yyyy+"-"+(mmChars[1]?mm:"0"+mmChars[0])+"-"+(ddChars[1]?dd:"0"+ddChars[0]);
  }
  convertTime()
  {
    var today = new Date();

    var hour = today.getHours().toString();
    var minutes = today.getMinutes().toString();
    var seconds = today.getSeconds().toString();

    var hhChars = hour.split('');
    var mmChars = minutes.split('');
    var ssChars = seconds.split('');

  return (hhChars[1]?hour:"0"+hhChars[0]) + ':' + (mmChars[1]?minutes:"0"+mmChars[0]) + ':' + (ssChars[1]?seconds:"0"+ssChars[0])  ;
  
  }


  /*  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    return time;

  }*/
  
  reset()
  {
    this.register['programa']=null;
    this.register['estacion']=null;
    this.register['equipo_nivel']=null;
    this.register['valor_nivel']=null;
    this.register['equipo_caudal']=null;
    this.register['valor_caudal']=null; 
    this.register['valor_temperatura']=null;
    this.register['valor_ph']=null;
    this.register['valor_conductividad']=null;
    this.register['valor_oxigeno']=null;
    this.register['equipo_turbidiometro']=null;
    this.register['valor_turbiedad']=null;
    this.register['valor_turbiedad']=null;
    this.register['equipo_multiparametro']=null;
 

    this.templateQty = {'ph':{'icon':'chevron-forward','color':'primary','value':'','factor':'','unidad':' u.ph'},
    'conductividad':{'icon':'chevron-forward','color':'primary','value':'','factor':'','unidad':' us/cm'},
    'nivel':{'icon':'chevron-forward','color':'primary','value':'','factor':'','unidad':' m.bnb'},
    'caudal':{'icon':'chevron-forward','color':'primary','value':'','factor':'','unidad':' l/s'},
    'temperatura':{'icon':'chevron-forward','color':'primary','value':'','factor':'','unidad':' °C'},
    'oxigeno':{'icon':'chevron-forward','color':'primary','value':'','factor':'','unidad':' mg/l',},
    'turbiedad':{'icon':'chevron-forward','color':'primary','value':'','factor':'', 'unidad':' NTU'},
    'sdt':{'icon':'chevron-forward','color':'primary','value':'','factor':'','unidad':' mg/l'}};
 


  }

  async presentLoading() {

    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
      duration: 2000
    });
    let date = new Date();
    //console.log(date);
    //console.log(this.convertDate(date));
    console.log(this.convertTime());
    console.log(this.convertDate(date));
    let programa =Number(this.register['programa']);
    let estacion = this.register['estacion'];
    let equipo_caudal = Number(this.register['equipo_caudal']);
    let equipo_nivel = Number(this.register['equipo_nivel']);
    let equipo_multiparametrico = Number(this.register['equipo_multiparametro']);
    let equipo_turbidiometro = Number(this.register['equipo_turbidiometro']);
    this.db.addMonitoreo(programa,estacion.trim(),equipo_nivel,this.register['valor_nivel'],equipo_caudal,this.register['valor_caudal'],equipo_multiparametrico,this.register['valor_temperatura'],this.register['valor_ph'],this.register['valor_conductividad'],this.register['valor_oxigeno'],equipo_turbidiometro,this.register['valor_turbiedad'],this.convertDate(date),this.convertTime(),'false',this.latitude,this.longitude);
    this.reset();
    await loading.present();
    this.router.navigate(['/']);

  
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Guardar Monitoreo',
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

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Los datos se han almacenado',
      duration: 2000
    });
    toast.present();
  }

  ionChangeValor(event,parameter){
    console.log(event.detail.value);
    console.log(parameter);
    let valueInsert = event.detail.value;

    let historicValue = this.templateQty[parameter]['value'];

    if((historicValue.trim()!='')&&(valueInsert!=''))
    { 
        let factor = valueInsert/historicValue;

        this.templateQty[parameter]['factor'] = factor.toFixed(1);

        if((factor<0.90)||(factor>1.50))
        {
           this.templateQty[parameter]['color']='warning';
           this.templateQty[parameter]['icon']='warning';
           this.error(parameter);
        }
        else
        {
          this.templateQty[parameter]['color']='success';
          this.templateQty[parameter]['icon']='checkmark-circle-outline';


        }


    }
    if(historicValue.trim()=='')
    {
        this.templateQty[parameter]['color']='success';
        this.templateQty[parameter]['icon']='checkmark-circle-outline';
        this.templateQty[parameter]['factor'] ='-'

    }
    if((valueInsert=='')||(valueInsert==undefined)){

      this.templateQty[parameter]['factor']=''
      this.templateQty[parameter]['color']='';
      this.templateQty[parameter]['icon']='chevron-forward';

    }
    

  }

 

}
