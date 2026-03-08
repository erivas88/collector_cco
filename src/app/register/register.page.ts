import { Component, OnInit } from '@angular/core';
import { DatabaseService , Dev } from '../services/database.service';
import { Observable, from,of } from 'rxjs';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ChartsPage } from '../charts/charts.page';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { IonicSelectableComponent } from 'ionic-selectable';

class Port {
  public id: number;
  public name: string;
}


/*nombre: string,
id: string,
programa: string*/





@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  

  latitude: any = 0; //latitude
  longitude: any = 0; //longitude
  color_error: any;
  ports: Port[];
  port: Port;
  developers: Dev[] = []; 
  products: Observable<any[]>; 
  estaciones:Observable<any[]>;
  usuarios:Observable<any[]>;  
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
  ischekd:any;

   phQ: any;
   tmQ: any;
   ceQ: any;
   OxQ: any;
   niQ: any;
   caQ: any;
   sdtQ: any;
   tuQ : any;



  

   templateQty = {
    'ph': {'icon': 'chevron-forward', 'textcolor': 'primary','color': 'primary', 'value': '', 'factor': '', 'unidad': ' u.ph', 'promedio': '', 'desviacion': ''},
    'conductividad': {'icon': 'chevron-forward','textcolor': 'primary', 'color': 'primary', 'value': '', 'factor': '', 'unidad': ' us/cm', 'promedio': '', 'desviacion': ''},
    'nivel': {'icon': 'chevron-forward','textcolor': 'primary', 'color': 'primary', 'value': '', 'factor': '', 'unidad': ' m.bnb', 'promedio': '', 'desviacion': ''},
    'caudal': {'icon': 'chevron-forward','textcolor': 'primary', 'color': 'primary', 'value': '', 'factor': '', 'unidad': ' l/s', 'promedio': '', 'desviacion': ''},
    'temperatura': {'icon': 'chevron-forward','textcolor': 'primary', 'color': 'primary', 'value': '', 'factor': '', 'unidad': ' °C', 'promedio': '', 'desviacion': ''},
    'oxigeno': {'icon': 'chevron-forward','textcolor': 'primary', 'color': 'primary', 'value': '', 'factor': '', 'unidad': ' mg/l', 'promedio': '', 'desviacion': ''},
    'turbiedad': {'icon': 'chevron-forward', 'textcolor': 'primary', 'color': 'primary', 'value': '', 'factor': '', 'unidad': ' NTU', 'promedio': '', 'desviacion': ''},
    'sdt': {'icon': 'chevron-forward','textcolor': 'primary', 'color': 'primary', 'value': '', 'factor': '', 'unidad': ' mg/l', 'promedio': '', 'desviacion': ''}
}


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
    public toastController: ToastController) {

   

      this.ports = [
        { id: 1, name: 'Tokai' },
        { id: 2, name: 'Vladivostok' },
        { id: 3, name: 'Navlakhi' }
      ];
     }
      

  ngOnInit() {

    this.validate_turb = 0;
    this.validate_color ='primary';
    this.validate_icon ='chevron-forward';
    this.register['fallido']='1';
   

    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {
       
        this.products = this.db.getProducts();
        this.estaciones = this.db.getStations();
        this.programas = this.db.getProgramas();
        this.equipos_caudal = this.db.getEquipoCaudal();
        this.equipos_nivel = this.db.getEquipoNivel();
        this.equipos_multiparametro = this.db.getEquipoMultiparametro();
        this.usuarios = this.db.getUsuarios();
        this.db.getStations().subscribe(
          (data: Port[]) => {
            this.ports = data;

          },
          error => {
            console.error('Error fetching data: ', error);
          }
        );

      }
    });
    console.log(this.products);
  }


  shouldDisplayWaterSection(): boolean {
    return this.register['tipo_agua'] == 1 || this.register['tipo_agua'] == '';
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
  actualizarEstaciones(programa){
    //alert(programa);

    console.log('progrma seleccionado =>', programa);
    this.estaciones= new Observable<[]>(); //limpiar observable estaciones
    this.db.updtStations(programa);
    this.estaciones = this.db.getStations();




    this.db.ComboEstaciones(programa).then(data =>
      { 
           console.log('proms=>',data)
           this.fill(data);
           this.ports = data;
  
      });

    
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
    

    console.log(this.db.ResumData(estacion.trim())); 
  

    this.db.ResumData(estacion.trim()).then(data =>
    { 
         console.log('proms=>',data)
         this.fill(data);

    });


  
   
  

  }


  portChange(event: {
    component: IonicSelectableComponent,
    value: any
  }) {
    console.log('port:', event.value.name);
    this.register['estacion'] = event.value.name;   
    this.getHistoric(event.value.name);
  }




calcularDesviacions(varianza) {
  if (varianza < 0) {
    return "No se puede calcular la desviación estándar de una varianza negativa";
  } else {
    return Math.sqrt(varianza).toString();
  }
}


calcularMedia(array) {
  if (array.length === 0) {
    return 0; // o puedes devolver NaN, dependiendo de tus necesidades
  }

  const suma = array.reduce((acumulador, valor) => acumulador + valor, 0);
  const media = suma / array.length;

  return media;
}

calcularDesviacionEstandar(array) {
  if (array.length <= 1) {
    return 0; // o puedes devolver NaN, dependiendo de tus necesidades
  }

  const media = this.calcularMedia(array);

  const sumaDeCuadrados = array.reduce((acumulador, valor) => {
    const diferencia = valor - media;
    return acumulador + diferencia * diferencia;
  }, 0);

  const varianza = sumaDeCuadrados / (array.length - 1);
  const desviacionEstandar = Math.sqrt(varianza);

  return desviacionEstandar;
}

  fill(data)
  {
    

    this.templateQty.ph.promedio= this.calcularMedia(data.data_ph).toString();
    this.templateQty.nivel.promedio = this.calcularMedia(data.data_nivel).toString(); 
    this.templateQty.conductividad.promedio=  this.calcularMedia(data.data_ce).toString(); 
    this.templateQty.caudal.promedio = this.calcularMedia(data.data_caudal).toString() ;
    this.templateQty.temperatura.promedio = this.calcularMedia(data.data_temp).toString() ;
    this.templateQty.sdt.promedio  = this.calcularMedia(data.data_sdt).toString();
    this.templateQty.oxigeno.promedio = this.calcularMedia(data.data_ox).toString();
    this.templateQty.turbiedad.promedio=  this.calcularMedia(data.data_turbiedad).toString();
    /**********************************************************/
    this.templateQty.ph.desviacion = this.calcularDesviacionEstandar(data.data_ph).toString();
    this.templateQty.nivel.desviacion = this.calcularDesviacionEstandar(data.data_nivel).toString();
    this.templateQty.conductividad.desviacion =  this.calcularDesviacionEstandar(data.data_ce).toString();
    this.templateQty.caudal.desviacion = this.calcularDesviacionEstandar(data.data_caudal).toString();
    this.templateQty.temperatura.desviacion = this.calcularDesviacionEstandar(data.data_temp).toString();
    this.templateQty.sdt.desviacion  = this.calcularDesviacionEstandar(data.data_sdt).toString();
    this.templateQty.oxigeno.desviacion = this.calcularDesviacionEstandar(data.data_ox).toString();
    this.templateQty.turbiedad.desviacion=this.calcularDesviacionEstandar(data.data_turbiedad).toString();
    console.log(this.templateQty);
    let totalElementos = data.totalElementos;

    if (totalElementos === 0)
    {
      // No se encontraron datos históricos asociados al punto seleccionado
        this.mostrarAlert("No se encontraron datos históricos asociados al punto de monitoreo seleccionado.");
    }
    else 
    {
      // Aquí puedes realizar otras operaciones si hay datos, si es necesario
    }




    

  }

  mostrarAlert(mensaje: string) {
    const alert = this.alertController.create({
        header: 'Informacións',
        message: mensaje,
        buttons: ['OK']
    });
    alert.then(alert => alert.present());
}



  async limitarLongitud(event: any) {
    const maxLength = 10;

    if (event.target.value.length > maxLength) {
        event.target.value = event.target.value.slice(0, maxLength);

        const alert = await this.alertController.create({
            header: 'Advertencia',
            message: 'La longitud máxima permitida es de 10 caracteres.',
            buttons: ['OK']
        });

        await alert.present();
    }
}


async limitarLongitudTXT(event: any) {
  const maxLength = 50;

  if (event.target.value.length > maxLength) {
      event.target.value = event.target.value.slice(0, maxLength);

      const alert = await this.alertController.create({
          header: 'Advertencia',
          message: 'La longitud máxima permitida es de 50 caracteres.',
          buttons: ['OK']
      });

      await alert.present();
  }
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
    let horamedida = this.register['datatime'];
    console.log('Esta es la hora =>',horamedida); 


    if (!this.register['datatime'] || this.register['datatime'].trim() === '')
    {
     
      console.log('El valor de "datatime" es nulo o vacío.');
      var fecha =  this.extraerFecha(date);
      var hora = (this.extraerHora(date)).toString();
     
  }
  else 
  {
     
      console.log('El valor de "datatime" es: ', this.register['datatime']);
      var fecha =  this.extraerFecha(this.register['datatime']);
      var hora = (this.extraerHora(this.register['datatime'])).toString();
   
  }



    this.db.addMonitoreo(programa,estacion.trim(),equipo_nivel,this.register['valor_nivel'],equipo_caudal,this.register['valor_caudal'],equipo_multiparametrico,this.register['valor_temperatura'],this.register['valor_ph'],this.register['valor_conductividad'],this.register['valor_oxigeno'],equipo_turbidiometro,this.register['valor_turbiedad'],fecha,hora,'false',this.latitude,this.longitude,this.register['profundidad'],this.register['observacion'], this.register['id_laboratorio'], this.register['inspector'],this.register['metodo'],this.register['tipo_agua'],this.register['tipo_nivel'],this.register['hora_nivel'],this.register['hidroquimico'],this.register['isotopico'],this.register['fallido']);
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

 extraerFecha(cadenaFecha) {
    // Crear un objeto de fecha a partir de la cadena proporcionada
    const fecha = new Date(cadenaFecha);

    // Verificar si la fecha es válida
    if (isNaN(fecha.getTime())) {
        // La cadena de fecha no es válida
        return null;
    }

    // Extraer los componentes de la fecha
    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Los meses comienzan desde 0, así que sumamos 1
    const dia = String(fecha.getDate()).padStart(2, '0');

    return `${año}-${mes}-${dia}`;
}
extraerHora(cadenaFecha) {
  // Crear un objeto de fecha a partir de la cadena proporcionada
  const fecha = new Date(cadenaFecha);

  // Verificar si la fecha es válida
  if (isNaN(fecha.getTime())) {
      // La cadena de fecha no es válida
      return null;
  }

  // Extraer los componentes de la hora
  const horas = String(fecha.getHours()).padStart(2, '0');
  const minutos = String(fecha.getMinutes()).padStart(2, '0');
  const segundos = String(fecha.getSeconds()).padStart(2, '0');

  return `${horas}:${minutos}:${segundos}`;
}
  convertDate(date) {

    var yyyy = date.getFullYear().toString();
    var mm = (date.getMonth()+1).toString();
    var dd  = date.getDate().toString();  
    var mmChars = mm.split('');
    var ddChars = dd.split(''); 
    return yyyy+"-"+(mmChars[1]?mm:"0"+mmChars[0])+"-"+(ddChars[1]?dd:"0"+ddChars[0]);
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
    this.register['profundidad']=null;
    this.register['observacion']=null;
    this.register['id_laboratorio']=null;
    this.register['inspector']=null;
    this.register['metodo']=null;
    this.register['tipo_agua']=null;
    this.register['tipo_nivel']=null;
    this.register['hora_nivel']=null;
    this.register['fallido']=null;    
    this.register['hidroquimico']=null;
    this.register['isotopico']=null;  
  


    this.templateQty = {
      'ph': {'icon': 'chevron-forward', 'textcolor': 'primary','color': 'primary', 'value': '', 'factor': '', 'unidad': ' u.ph', 'promedio': '', 'desviacion': ''},
      'conductividad': {'icon': 'chevron-forward','textcolor': 'primary', 'color': 'primary', 'value': '', 'factor': '', 'unidad': ' us/cm', 'promedio': '', 'desviacion': ''},
      'nivel': {'icon': 'chevron-forward','textcolor': 'primary', 'color': 'primary', 'value': '', 'factor': '', 'unidad': ' m.bnb', 'promedio': '', 'desviacion': ''},
      'caudal': {'icon': 'chevron-forward','textcolor': 'primary', 'color': 'primary', 'value': '', 'factor': '', 'unidad': ' l/s', 'promedio': '', 'desviacion': ''},
      'temperatura': {'icon': 'chevron-forward','textcolor': 'primary', 'color': 'primary', 'value': '', 'factor': '', 'unidad': ' °C', 'promedio': '', 'desviacion': ''},
      'oxigeno': {'icon': 'chevron-forward','textcolor': 'primary', 'color': 'primary', 'value': '', 'factor': '', 'unidad': ' mg/l', 'promedio': '', 'desviacion': ''},
      'turbiedad': {'icon': 'chevron-forward', 'textcolor': 'primary', 'color': 'primary', 'value': '', 'factor': '', 'unidad': ' NTU', 'promedio': '', 'desviacion': ''},
      'sdt': {'icon': 'chevron-forward','textcolor': 'primary', 'color': 'primary', 'value': '', 'factor': '', 'unidad': ' mg/l', 'promedio': '', 'desviacion': ''}
  }


  }

  async presentLoading() {

    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
      duration: 2000
    });
    let date = new Date();
    console.log(this.convertTime());
    console.log(this.convertDate(date));
    let programa =Number(this.register['programa']);
    let estacion = this.register['estacion'];
    let equipo_caudal = Number(this.register['equipo_caudal']);
    let equipo_nivel = Number(this.register['equipo_nivel']);
    let equipo_multiparametrico = Number(this.register['equipo_multiparametro']);
    let equipo_turbidiometro = Number(this.register['equipo_turbidiometro']);

    
    if (!this.register['datatime'] || this.register['datatime'].trim() === '')
    {
     
      console.log('El valor de "datatime" es nulo o vacío.');
      var fecha =  this.extraerFecha(date);
      var hora = (this.extraerHora(date)).toString();
     
  }
  else 
  {
     
      console.log('El valor de "datatime" es: ', this.register['datatime']);
      var fecha =  this.extraerFecha(this.register['datatime']);
      var hora = (this.extraerHora(this.register['datatime'])).toString();
   
  }  

    
    

    this.db.addMonitoreo(programa,estacion.trim(),equipo_nivel,this.register['valor_nivel'],equipo_caudal,this.register['valor_caudal'],equipo_multiparametrico,this.register['valor_temperatura'],this.register['valor_ph'],this.register['valor_conductividad'],this.register['valor_oxigeno'],equipo_turbidiometro,this.register['valor_turbiedad'],fecha,hora,'false',this.latitude,this.longitude,this.register['profundidad'],this.register['observacion'], this.register['id_laboratorio'], this.register['inspector'],this.register['metodo'],this.register['tipo_agua'],this.register['tipo_nivel'],this.register['hora_nivel'],this.register['hidroquimico'],this.register['isotopico'], this.register['fallido']);
    
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
      message: '<ion-icon name="server-outline" class="toast-icon"></ion-icon> Los datos se han almacenado localmente.',
      duration: 2000
    });
    toast.present();
  }

  esOutlier(valor, media, desviacionEstandar, umbralZ = 3.0) {
    const zScore = Math.abs((valor - media) / desviacionEstandar);
  
    return zScore > umbralZ;
  }
  


  async mostrarToast() {
    const toast = await this.toastController.create({
      message: 'Valor fuera del rango esperado',
      duration: 1000, // Duración en milisegundos
      position: 'bottom', // Posición del toast ('top', 'middle', 'bottom')
      color: 'danger' // Color del toast (puedes usar valores como 'primary', 'secondary', 'danger', etc.)
    });

    await toast.present();
  }

  async mostrarAlerta() {
  const alert = await this.alertController.create({
    header: 'Alerta',
    message: 'Valor fuera del rango esperado',
    buttons: ['Aceptar']
  });

  await alert.present();
}

fallidoevent(event)
{
  console.log(event.detail.value);
  this.register['fallido'] = event.detail.value;
}


  ionChangeValor(event,parameter)
  {
    console.log(event.detail.value);
    console.log(parameter);
    let valueInsert = parseFloat(event.detail.value);
    //let historicValue = this.templateQty[parameter]['value'];
    let promedio =  parseFloat(this.templateQty[parameter]['promedio']);
    let desviacion = parseFloat(this.templateQty[parameter]['desviacion']);
    console.log('promedio => ', parseFloat(this.templateQty[parameter]['promedio']))
    console.log('desvSt => ', parseFloat(this.templateQty[parameter]['desviacion']))
    console.log(promedio,desviacion,valueInsert)
    let isOutlier = this.esOutlier(valueInsert,promedio,desviacion)
    console.log(isOutlier);

    if(isOutlier==false)
    {
       console.log('Valor Aceptable')
       this.templateQty[parameter]['color']='success';
       this.templateQty[parameter]['icon']='checkmark-circle';
       this.color_error='primary'
    }
    else
    {
      console.log('Valor Anomalo')
      this.templateQty[parameter]['color']='warning';
      this.templateQty[parameter]['icon']='warning';
      this.mostrarToast();
      this.color_error='danger'
    }
    if(isNaN(valueInsert)) {
      this.templateQty[parameter]['color']='primary';
      this.templateQty[parameter]['icon']='chevron-forward';
    }

    /*if((historicValue.trim()!='')&&(valueInsert!=''))
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
          this.templateQty[parameter]['icon']='checkmark-circle';


        }


    }
    if(historicValue.trim()=='')
    {
        this.templateQty[parameter]['color']='success';
        this.templateQty[parameter]['icon']='checkmark-circle';
        this.templateQty[parameter]['factor'] ='-'

    }
    if((valueInsert=='')||(valueInsert==undefined)){

      this.templateQty[parameter]['factor']=''
      this.templateQty[parameter]['color']='';
      this.templateQty[parameter]['icon']='chevron-forward';

    }*/
    

  }

 

}
