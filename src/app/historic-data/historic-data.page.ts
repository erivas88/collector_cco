import { Component, OnInit } from '@angular/core';
import { DatabaseService , Dev } from '../services/database.service';
import { Observable } from 'rxjs';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import * as HighCharts from 'highcharts';
import NoDataToDisplay from 'highcharts/modules/no-data-to-display';
import HC_exporting from 'highcharts/modules/exporting';
import HC_exportData from 'highcharts/modules/export-data';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-historic-data',
  templateUrl: './historic-data.page.html',
  styleUrls: ['./historic-data.page.scss'],
})
export class HistoricDataPage implements OnInit {

  selectedView = 'devs';
  estaciones:Observable<any[]>;
  parametros:Observable<any[]>; 
  estaciones_selct : any;
  parametros_selct : any;
  chartOptions: any;
  historicos: any[];
  construcSerie: any;
  construcSerie1:  any[];
  textToDisplay:string='';
  textToDisplay1:string='';
  route_estacion_memory : any;
  route_parametro_memory: any;
  count =0;
  estado=false;
  hitos=false;
  inverted1=false;

  constructor(private db: DatabaseService,
    public alertController: AlertController,
    public loadingController: LoadingController,
    private router: Router,
    public modalController: ModalController,
    public toastController: ToastController) { }

  ngOnInit() {
  
    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {      
       
        this.estaciones = this.db.getStations(); 
        this.parametros = this.db.getParameters();        

      }
    });

   


  }
  ionViewDidEnter() { 
    //this.fillChart('','');

    if(this.count==0)
    {
      this.ChartPopulation([]);
      this.count++;
    }
    else
    { 
      console.log('equals');

    }
  /*

    if((this.route_estacion_memory == this.estaciones_selct)&&(this.route_parametro_memory==this.parametros_selct))
    {
     
     
    }
    else
    {
   
      
    }*/

  
  }

  doRefresh(event) {

    this.fillChart('','');
    this.estado=false;
    this.hitos=false;
    this.inverted1=false;
    this.estaciones_selct ='';
    this.parametros_selct ='';
    this.textToDisplay='';
    this.textToDisplay1='';
    this.ChartPopulation([]);
    this.db.loadStations();
  
    event.target.complete();    

   

  }
  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Sin Resultados',
      duration: 2000,
      color: 'primary'
    });
    toast.present();
  }
  fillChart(estaciones,parametros){

    if(estaciones.length>1)
    {
       this.textToDisplay = "("+estaciones.length+")" ;
       console.log('text',this.textToDisplay);

    }
    if(parametros.length>1)
    {
       this.textToDisplay1 = "("+parametros.length+")" ;
       console.log('text',this.textToDisplay1);

    }

   



    let serieData=[];
    let name;
    let content;

        console.log('this is a chart');
        let data = [];
        let serieHigh =[], i=0;
        let parametro = parametros;
         let estacion = estaciones;
        if((parametros==undefined)||(estaciones==undefined)){
           
          console.log('error');
           //this.db.loadHistoricoP('','');
           this.ChartPopulation([]);
        }
        else{

          this.route_estacion_memory = estaciones;
          this.route_parametro_memory = parametros;

          

          for(let entrada_estacion of estaciones)
          { 
              console.log('estacion->',entrada_estacion);
           
               for(let entrada_parametro of parametros)
               {
                this.db.loadHistoricoP(entrada_parametro.trim(),entrada_estacion.trim());
                this.db.getHistoricop().subscribe((data) => {
                  this.historicos= data;
                  console.log('recibido->',data.length);
                  console.log('data',data)
                  if(this.historicos.length!=0)
                  {
                    serieHigh.push(data);
                  }
                console.log('dataserie->',serieHigh); 
                this.ChartPopulation(serieHigh); 
                 
                }, (err) => {
                console.log(err);
                });

               }            
  
            
          }
         

          /*

         

          console.log('parametro',parametro);
          console.log('estacion',estacion)
          
          this.db.loadHistoricoP(parametro.trim(),estacion.trim());  
        
         this.db.getHistoricop().subscribe((data) => {
            this.historicos= data;
            console.log(data);
            console.log('elements',data.length)
            if(data.length>0)
            {
              console.log(this.historicos)
              let serie = [{name:estacion+" ["+parametro+"]",color :'#ffb10a' ,data: this.historicos}]; 
              this.ChartPopulation(this.historicos);

            }
            if(data.length==0)
            {
              this.presentToast()
              let serie = [{name:estacion+" ["+parametro+"]",color :'#ffb10a' ,data: this.historicos}]; 
              this.ChartPopulation(this.historicos);
            }
           
          }, (err) => {
          console.log(err);
          });*/
          
       

        }
      

  }
  fillSerie(data)
  {
    console.log('Test');
    console.log(data);
    let serie = data ;  
   console.log(serie);
   /*if(data!=undefined)
   {
      this.construcSerie1.push(serie);
   } */  
   this.construcSerie1.push(serie);
   console.log(this.construcSerie1);
  

  }
  async locationSucess() { 

  

    const toast = await this.toastController.create({
      message: 'Estacion sin datos',
      duration: 2000,
      color:'primary'
    });
    toast.present();
   
  }
  ChartPopulation(data) {    

   if(this.parametros_selct==undefined){

    this.parametros_selct='';
   }

   if(this.estaciones_selct==undefined){
     
    this.estaciones_selct='';
   }

   if(data.length==0)
   {
      //this.locationSucess()
   }
   
   

   


    this.chartOptions =   HighCharts.setOptions({

    
     
      lang: {
          loading: 'Cargando...',
          months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
          weekdays: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
          shortMonths: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],  printChart: 'Imprimir',
          contextButtonTitle: 'Exportar',
          resetZoom: 'Reiniciar zoom',
          resetZoomTitle: 'Reiniciar zoom',
          decimalPoint: ',',
          thousandsSep: '.',
          noData: 'Sin Datos para mostrar',
         
      },
      exporting: {
        enabled: false,
        tableCaption: 'Data table',
        csv: {
            dateFormat: '%Y-%m-%d'
        },   
           
        buttons: {
            contextButton: {
                menuItems: ['printChart', 'downloadJPEG', 'downloadPDF', 'downloadCSV', 'downloadXLS', ]
            }
        },
        chartOptions: {
            navigator: {
                enabled: false
            },
            scrollbar: {
                enabled: false
            },
           
        }
    },
     
  });

    this.chartOptions = HighCharts.chart('highcharts_result_historic', {
        chart: {
          backgroundColor: 'transparent',
          type: 'line', 
          zoomType: 'x',     
       
        },
        title: {
          text: this.estaciones_selct+' ['+this.parametros_selct+']',
          style: {
            color: '#9a9ca8',
            font: '11px "nuni-black", sans-serif',
        }
        },
        xAxis: {

          type: 'datetime',
          gridLineWidth: 1,
          
          crosshair: {
            width: 1,
            color: 'gray',
            dashStyle: 'Dash'
        },
          labels: {
            style: {
             
                font: '11px "nuni-black", sans-serif',
           }
        }
        },
         credits: {
                enabled: false,
        },
        yAxis: [{
          title: {
            text: this.estaciones_selct+' ['+this.parametros_selct+']',
              style: {
                 font: '10px "nuni-black", sans-serif',
                  color: 'grey'
              },
          },
          labels: {
              format: '{value:.1f}',
              style: {
                font: '10px "nuni-black", sans-serif',
             }
          },
          opposite: false,
          margin: 15,
          crosshair: {
            width: 1,
            color: 'gray',
            dashStyle: 'Dash'
        },
      }, {
          
          title: {
              text: '',
              style: {
                font: '10px "nuni-black", sans-serif',
                  color: 'grey'
              },
          },
          labels: {
              format: '{value:.1f}',
              style: {
                font: '10px "nuni-black", sans-serif',
             }
          },
          opposite: true,
          margin: 15,
      }],
       
        lang: {
          noData: 'Sin Datos para mostrar',
         
          
          
      },
      
      noData: {

        style: {
          font: '13px "nuni-black", sans-serif',
    }

      },
        tooltip: {
          xDateFormat: '%d-%m-%Y',
          shared: true,
          style: {
            color: '#132B43',
            font: '11px "nuni-black", sans-serif',
      }
      }, legend: {
        enabled: true,
        itemStyle: {
          font: '11px "nuni-black", sans-serif',
         color: 'gray',
        }
    },   
   
    series: data,
    
    plotOptions: {
      series: {
          connectNulls: true
      }
  },

});
    
}

change_ht3(event){

  let inicio : any ;
  let minimoAxis : any;
  inicio = '1270166400000';    
  let xaxis = this.chartOptions.xAxis[0].dataMin;
  console.log(this.chartOptions.xAxis[0].dataMin);     
    // tslint:disable-next-line: variable-name
  let array_minus =[];
  array_minus.push(inicio*1);
  array_minus.push(xaxis);

  minimoAxis = this.GetMin(array_minus);

  const array_hitos = [{color: "#FF6347",day: "02",fecha: "2010-04-01",id_hito: "1",miliseconds: 1270166400000, month: "04",nombre_hito: "Inicio Construcción ",width: "2",year: "2010"}];

  if(event.detail.checked===true){      
    console.log('Se Muestra Hito');

    this.hitos = true;

    // tslint:disable-next-line: one-variable-per-declaration
   

    console.log(minimoAxis);

    this.chartOptions.xAxis[0].addPlotLine({ 

    value: Date.UTC(2010,4,1),
                  width: '1.5',
                  color: '#FF6347',
                  dashStyle: 'dash',
                  id: 'first',
                  label: {
                      text: 'Inicio Construcción',
                      rotation: 90,
                      textAlign: 'left',
                      style: {
                          font: '11px "Nunito", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
                      }
                  }

  });


    this.chartOptions.xAxis[0].addPlotLine({ 

      value: Date.UTC(2013,3,12),
                    width: '1.5',
                    color: '#0000ff',
                    dashStyle: 'dash',
                    id: 'second',
                    label: {
                        text: 'Operación SX-EW',
                        rotation: 90,
                        textAlign: 'left',
                        style: {
                            font: '11px "Nunito", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
                        }
                    }

    });

    
    this.chartOptions.xAxis[0].addPlotLine({ 

    value: Date.UTC(2014,5,31),
                  width: '1.5',
                  color: '#FF0000',
                  dashStyle: 'dash',
                  id: 'three',
                  label: {
                      text: 'Operación Concentradora',
                      rotation: 90,
                      textAlign: 'left',
                      style: {
                          font: '11px "Nunito", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
                      }
                  }

  });
    this.chartOptions.xAxis[0].setExtremes((minimoAxis), (this.chartOptions.xAxis[0].datamax));
  }else{
   
    this.hitos = false;
    this.chartOptions.xAxis[0].removePlotLine('three');
    this.chartOptions.xAxis[0].removePlotLine('second');
    this.chartOptions.xAxis[0].removePlotLine('first');
    this.chartOptions.xAxis[0].setExtremes((this.chartOptions.xAxis[0].dataMin), (this.chartOptions.xAxis[0].datamax));
     
  }

}
SecondaryAxis(event){
  // console.log(event)
  if(event.detail.checked===true){
   this.CountSeries();
   this.chartOptions.yAxis[0].setTitle({ text: " " });
   this.chartOptions.yAxis[1].setTitle({ text: " " });
     //  this.chartOptions.yAxis[1].setTitle({ " " });
    }
    else{

     this.DisabledySecondary();

    }   

  
 }
GetMin(array) {
          
  return Math.min.apply(Math, array);

}
DisabledySecondary()
{
  let position =0;
  let eje =0;
  let series =  this.chartOptions.series;
  console.log(series.length);

  this.chartOptions.yAxis[0].setTitle({ text: " " });
  this.chartOptions.yAxis[1].setTitle({ text: " " });

  for (const entry of series) {
   // console.log(entry); // "4", "5", "6"
   console.log(entry.name, position); 
   this.chartOptions.series[position].update({
    yAxis: 0,
}, true);
   position++;
       // tslint:disable-next-line: triple-equals
 

  }
  
}
async CountSeries()
{
  let position =0;
  let eje =0;
  let series =  this.chartOptions.series;
  console.log(series.length);

  const alert = await this.alertController.create({
    cssClass: 'my-custom-class',
    header: 'Error',
   
    message: 'No se puede generar eje secundario',
    buttons: ['OK']
  });

// tslint:disable-next-line: triple-equals
  if(series.length == 0 || series.length < 2 ){
  await alert.present();
  this.estado = false;

}
else {
 //console.log(series.length);
  //this.chartOptions.yAxis[0].setTitle({ text: series[0].name+" ["+series[1].userOptions.tooltip.valueSuffix+"]" });
  //this.chartOptions.yAxis[1].setTitle({ text: series[1].name+" ["+series[1].userOptions.tooltip.valueSuffix+"]" });

  //console.log(series[0].name);
  //console.log(series[1].userOptions.tooltip);
  //console.log(series[1]);
  if(series.lenght == 2){
    console.log("Exacto dos")
    console.log(series.length);
    for (const entry of series) {
   
      console.log(entry.name, position); 
      this.chartOptions.series[position].update({
       yAxis: eje,
   }, true);
      position++;
      eje++;
      // tslint:disable-next-line: triple-equals
      if (eje == 2)
      {
        eje = 0;
      }

     }

  }
  else{
   
   

    if(series.length==2)
    {
      this.chartOptions.yAxis[0].setTitle({ text: series[0].name+" ["+series[0].userOptions.tooltip.valueSuffix+"]" });
      this.chartOptions.yAxis[1].setTitle({ text: series[1].name+" ["+series[1].userOptions.tooltip.valueSuffix+"]" });
      console.log(series[1].userOptions.color);
      this.chartOptions.yAxis[0].update({
        title: {
           
            style: {
                color: series[0].userOptions.color,
            }
        },
labels: { 
style: {
                color: series[0].userOptions.color,
            }
}
    });


    this.chartOptions.yAxis[1].update({
      title: {
         
          style: {
              color: series[1].userOptions.color,
          }
      },
labels: { 
style: {
              color: series[1].userOptions.color,
          }
}
  });

      
      for (const entry of series) {
      

        console.log(entry.name, position); 
        this.chartOptions.series[position].update({
         yAxis: eje,
     }, true);
        position++;
        eje++;
        // tslint:disable-next-line: triple-equals
        if (eje == 2)
        {
          eje = 0;
        }
  
       }
    
    }
    else{

      for (const entry of series) {
      

        console.log(entry.name, position); 
        this.chartOptions.series[position].update({
         yAxis: eje,
     }, true);
        position++;
        eje++;
        // tslint:disable-next-line: triple-equals
        if (eje == 2)
        {
          eje = 0;
        }
  
       }
     


      
    }

    /*for (const entry of series) {
      

      console.log(entry.name, position); 
      this.chartOptions.series[position].update({
       yAxis: eje,
   }, true);
      position++;
      eje++;
      // tslint:disable-next-line: triple-equals
      if (eje == 2)
      {
        eje = 0;
      }

     }
  }
 
  // this.chartOptions.yAxis[0].setTitle({ text: "Bananas"});
   /* if(series.lenght===2 ){
      console.log("son dos");
     
      //this.chartOptions.yAxis[0].setTitle({ text: series[0].name+" ["+series[1].userOptions.tooltip.valueSuffix+"]" });
      //this.chartOptions.yAxis[1].setTitle({ text: series[1].name+" ["+series[1].userOptions.tooltip.valueSuffix+"]" });
      

    }*/
  }

}

 
  
}
axis_1(event){

  if(event.detail.checked===true){  

    this.chartOptions.yAxis[0].update({
      reversed: true
     });
    
   
  }else{

    this.chartOptions.yAxis[0].update({
      reversed: false
     });

  }

}

}
