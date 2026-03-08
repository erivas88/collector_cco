import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { DatabaseService, Dev, Mnt  } from '../services/database.service';
import { Observable } from 'rxjs';
import { ChartsPage } from '../charts/charts.page';
import { AlertController, ModalController } from '@ionic/angular';




 

@Component({
  selector: 'app-monitoreo',
  templateUrl: './monitoreo.page.html',
  styleUrls: ['./monitoreo.page.scss'],
})
export class MonitoreoPage implements OnInit {

  id_monitoreo: any ;
  register = {};
  developers: Dev[] = []; 
  products: Observable<any[]>; 
  estaciones:Observable<any[]>; 
  programas : Observable<any[]>; 
  equipos_caudal  : Observable<any[]>;
  equipos_nivel :  Observable<any[]>;
  equipos_multiparametro:  Observable<any[]>;
  developer = {};
  product = {};
  programa_get:  any;
  progrmasdb : any;
  registros : Mnt = null;
  registrosdb :any;
  fecha : any;
  enviado : boolean;
  atributo = '';
  isReadonly: any;

  years: any[ ] = [
    {
      id: 1,
      name: '2019'
    },
    {
      id: 2,
      name:'2018'
    },
    {
      id: 3,
      name:'2017'
    },{
      id:4,
      name:'2016'
    }
  ];

  validate_turb = 0;
  validate_color ='primary';
  validate_icon ='chevron-forward';
  compareWith : any ;
  MyDefaultYearIdValue : string ;



  templateQty = {'ph':{'icon':'chevron-forward','color':'primary','value':'','factor':'','unidad':' u.ph'},
  'conductividad':{'icon':'chevron-forward','color':'primary','value':'','factor':'','unidad':' us/cm'},
  'nivel':{'icon':'chevron-forward','color':'primary','value':'','factor':'','unidad':' m.bnb'},
  'caudal':{'icon':'chevron-forward','color':'primary','value':'','factor':'','unidad':'l/s'},
  'temperatura':{'icon':'chevron-forward','color':'primary','value':'','factor':'','unidad':' °C'},
  'oxigeno':{'icon':'chevron-forward','color':'primary','value':'','factor':'','unidad':' mg/l',},
  'turbiedad':{'icon':'chevron-forward','color':'primary','value':'','factor':'', 'unidad':' NTU'},
  'sdt':{'icon':'chevron-forward','color':'primary','value':'','factor':'','unidad':' mg/l'}};
 

  constructor(private route: ActivatedRoute, 
              private db: DatabaseService,
              private router: Router,
              public toastController: ToastController,
              public alertController: AlertController,
              public modalController: ModalController) { 

               
              }
 

              ngOnInit() {
        
                this.db.getDatabaseState().subscribe(rdy => {
                  if (rdy) {
                    this.db.getDevs().subscribe(devs => {
                      this.developers = devs;
                    })
                    this.products = this.db.getProducts();
                    this.estaciones = this.db.getStations();
                    this.programas = this.db.getProgramas();
                    console.log(this.programas);  
                    this.equipos_caudal = this.db.getEquipoCaudal();
                    this.equipos_nivel = this.db.getEquipoNivel();
                    this.equipos_multiparametro = this.db.getEquipoMultiparametro(); 
                    this.db.getProgramas().subscribe((data) => {
                      this.progrmasdb = data;
                    }, (err) => {
                    console.log(err);
                    });
          
                     
            
                  }
                });
                console.log(this.products);
                
            
              }
            ionViewDidEnter(){  
    this.id_monitoreo = this.route.snapshot.queryParamMap.get('id');     
    

    this.db.getMonitoreo(this.id_monitoreo).then(data => {



      this.registrosdb= data;
       console.log('dataArray :'+data);
       console.log('dataArray: ' + JSON.stringify(data));
      let  programa = this.register['programa'];
      this.isReadonly=this.register['send'];
      this.register['send'] = this.registrosdb.ischecked;
      this.register['estacion'] = this.registrosdb.estacion;
      this.register['valor_nivel'] = this.registrosdb.valor_nivel;     
      this.register['valor_caudal'] =this.registrosdb.valor_caudal;    
      this.register['valor_temperatura']=this.registrosdb.valor_temperatura;
      this.register['valor_ph']=this.registrosdb.valor_ph;  ;
      this.register['valor_conductividad']=this.registrosdb.valor_conductividad;  ;
      this.register['valor_oxigeno']=this.registrosdb.valor_oxigeno;  ;
      this.register['valor_turbiedad']=this.registrosdb.valor_turbiedad;
     // this.register['programa'] =this.registrosdb.programa;
     // this.register['programa'] = this.registrosdb.programa;   
     // console.log('programa almacenado es :'+this.registrosdb.programa);
    
      this.register['programa'] = parseInt(this.registrosdb.programa, 10);
      console.log('programa almacenado es :'+   this.register['programa']);
      this.register['equipo_caudal']= this.registrosdb.equipo_caudal;
      this.register['equipo_nivel']=this.registrosdb.equipo_nivel;
      this.register['equipo_multiparametro']= this.registrosdb.equipo_multiparametro;
      this.register['equipo_turbidiometro']= this.registrosdb.equipo_turbiedad;
      this.register['datatime'] = this.registrosdb.fecha + " " + this.registrosdb.hora; 
      this.register['latitud'] = this.registrosdb.latitud; 
      this.register['longitud'] = this.registrosdb.longitud; 
      this.register['profundidad'] = this.registrosdb.profundidad;
      /**Nuevos Registros JVA**/
      this.register['observacion'] = this.registrosdb.observacion;
      this.register['id_laboratorio'] = this.registrosdb.id_laboratorio;
      this.register['inspector'] = this.registrosdb.inspector; 
      /**Nuevos Registros JRK**/
      /*
      this.register['metodo'],this.register['tipo_agua'],this.register['tipo_nivel'],this.register['hora_nivel']
       */
      this.register['metodo'] = this.registrosdb.metodo;
      this.register['tipo_agua'] = this.registrosdb.tipo_agua;
      this.register['tipo_nivel'] = this.registrosdb.tipo_nivel;
      this.register['hora_nivel'] = this.registrosdb.hora_nivel; 
     /**Nuevos Registros RTS**/
      this.register['hidroquimico'] = this.registrosdb.hidroquimico;
      this.register['isotopico'] = this.registrosdb.isotopico;
      this.register['fallido'] = this.registrosdb.fallido;
      
      console.log(this.registrosdb);
      console.log(this.register);
      this.getHistoric(this.registrosdb.estacion);

     
    });

    

    console.log(this.db.getMonitoreo(1));   
    this.MyDefaultYearIdValue = "1" ;
    this.compareWith = this.compareWithFn;
    console.log(this.programas);  
    console.log(this.id_monitoreo);
    this.isReadonly=this.register['send'];
   


   

   

  

  }
  ionViewWillEnter(){
    console.log('hola');
   

   
    this.programa_get ='1';
  }
  getHistoric(estacion)
  { 
   
      console.log('estacion->',estacion);    
      this.db.loadQaqck(estacion.trim()).then(data => { 
 
      console.log('inside',data);
      this.fill(data);
      

    })   

  } 



  shouldDisplayWaterSection(): boolean {
    return this.register['tipo_agua'] == 1 || this.register['tipo_agua'] == '';
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


    /********************************** */
  
    console.log(this.templateQty.ph);

    let elements =['nivel','caudal','ph','temperatura','conductividad','oxigeno','turbiedad','sdt']
    
    for (let entry of elements ){

        console.log(entry);

        let indice ='valor_'+entry;

        let valueInsert = this.register[indice];
        let historicValue = this.templateQty[entry]['value'];

        if((historicValue.trim()!='')&&(valueInsert!=''))
        { 
            let factor = valueInsert/historicValue;
    
            this.templateQty[entry]['factor'] = factor.toFixed(2);
    
            if((factor<0.90)||(factor>1.50))
            {
               this.templateQty[entry]['color']='warning';
               this.templateQty[entry]['icon']='warning';
            }
            else
            {
              this.templateQty[entry]['color']='success';
              this.templateQty[entry]['icon']='checkmark-circle';
    
            }  
    
           
        }
        if(historicValue.trim()=='')
        {
            this.templateQty[entry]['color']='success';
            this.templateQty[entry]['icon']='checkmark-circle';
            this.templateQty[entry]['factor'] ='-'
    
        }
        if((valueInsert=='')||(valueInsert==undefined)){
    
          this.templateQty[entry]['factor']=''
          this.templateQty[entry]['color']='';
          this.templateQty[entry]['icon']='chevron-forward';
    
        }


   
        
        
    }


  

    

  }
  countdata(data){
    console.log('elements->',data.count);
  }

  compareWithFn(o1, o2) {
    return o1 === o2;
  };
  deleteMonitoreo(id)
  {
    this.db.deleteMonitoreo(id);
    this.router.navigate(['/']);   
  }



 
  resetForm()
  {

     this.register['programa']=null;
    // this.register['estacion']=null;
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


     //se agregan 3 parametros al formulario
     this.register['observacion']=null;
     this.register['id_laboratorio']=null;
     this.register['inspector']=null;

    //se agregan 4 parametros al formulario
     this.register['metodo']=null;
     this.register['tipo_agua']=null;
     this.register['tipo_nivel']=null;
     this.register['hora_nivel']=null;

    //se agregan 4 parametros al formulario
     this.register['hidroquimico']=null;
     this.register['isotopico']=null;
     this.register['fallido']=null;

 

  }
  updateMonitoreo()
  {
    let updatedata =[{
                      programa :this.register['programa'],
                      equipo_nivel: this.register['equipo_nivel'],
                      valor_nivel :this.register['valor_nivel'],
                      equipo_caudal :this.register['equipo_caudal'],
                      valor_caudal :this.register['valor_caudal'],
                      equipo_multiparametro :this.register['equipo_multiparametro'],
                      valor_temperatura :this.register['valor_temperatura'],
                      valor_ph :this.register['valor_ph'],
                      valor_conductividad :this.register['valor_conductividad'],
                      valor_oxigeno :this.register['valor_oxigeno'],
                      equipo_turbidimetro :this.register['equipo_turbidiometro'],
                      valor_turbiedad :this.register['valor_turbiedad'],
                      profundidad :this.register['profundidad'],
                      observacion : this.register['observacion'],
                      id_laboratorio: this.register['id_laboratorio'],
                      inspector : this.register['inspector'],
                      id_monitoreo :  this.id_monitoreo,
                      metodo: this.register['metodo'],
                      tipo_agua: this.register['tipo_agua'],
                      tipo_nivel : this.register['tipo_nivel'],
                      hora_nivel : this.register['hora_nivel'],
                      datetime : this.register['datatime'],
                      hidroquimico : this.register['hidroquimico'],
                      isotopico : this.register['isotopico'],
                      fallido : this.register['fallido'],
                      }]
   
    this.db.updateDataMonitoreo(updatedata[0]);  
  }

  async presentAlertConfirm(id) {
    const alert = await this.alertController.create({
      cssClass: 'ion-color-primary ',
      header: 'Eliminar Monitoreo',
      message: '¿Desea eliminar este monitoreo?',
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
            this.deleteMonitoreo(id);
          }
        }
      ]
    });

    await alert.present();
  }

  async updateData() {
    const alert = await this.alertController.create({
      cssClass: 'ion-color-primary ',
      header: 'Actualizar Datos',
      message: '¿Desea actualizar los datos este monitoreo?',
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
            this.updateMonitoreo();
            this.router.navigate(['/']); 
          }
        }
      ]
    });

    await alert.present();
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

    
  
    if ((nivel==null)||(nivel==undefined)||(estacion==undefined))
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

  ionViewDidLeave(){

    this.updateMonitoreo();
    this.presentToast();

  
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Sus Datos se han Actualizado.',
      duration: 2000
    });
    toast.present();
  }

   ionChangeValor(event,parameter){
    console.log(event.detail.value);
    console.log(parameter);
    let valueInsert = event.detail.value;

    let historicValue = this.templateQty[parameter]['value'];

    if((historicValue.trim()!='')&&(valueInsert!=''||valueInsert!='null'))
    { 
        let factor = valueInsert/historicValue;


        if (Number.isNaN(factor))
        {
          this.templateQty[parameter]['factor'] ='-';

        }
        else{

          if((factor<0.5)||(factor>2.0))
          {
             this.templateQty[parameter]['factor'] = factor.toFixed(1);
             this.templateQty[parameter]['color']='warning';
             this.templateQty[parameter]['icon']='warning';
          }
          else
          {
            this.templateQty[parameter]['factor'] = factor.toFixed(1);
            this.templateQty[parameter]['color']='success';
            this.templateQty[parameter]['icon']='checkmark-circle';
  
          }



        }   
      

       


    }
    if(historicValue.trim()=='')
    {
        this.templateQty[parameter]['color']='success';
        this.templateQty[parameter]['icon']='checkmark-circle';
        this.templateQty[parameter]['factor'] ='-'

    }
    if((valueInsert=='')||(valueInsert==undefined)||(valueInsert===null)){

      this.templateQty[parameter]['factor']=''
      this.templateQty[parameter]['color']='';
      this.templateQty[parameter]['icon']='chevron-forward';

    }
    

  }

  


}
