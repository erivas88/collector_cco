import { Component, Input, OnInit } from '@angular/core';
import { DatabaseService , Dev } from '../services/database.service';
import { ModalController, NavParams } from '@ionic/angular';
import * as HighCharts from 'highcharts';
import NoDataToDisplay from 'highcharts/modules/no-data-to-display';
import HC_exporting from 'highcharts/modules/exporting';
import HC_exportData from 'highcharts/modules/export-data';
import * as Highcharts from 'highcharts';
import { Observable } from 'rxjs';

NoDataToDisplay(Highcharts);
HC_exporting(Highcharts);
HC_exportData(Highcharts);


@Component({
  selector: 'app-charts',
  templateUrl: './charts.page.html',
  styleUrls: ['./charts.page.scss'],
})
export class ChartsPage implements OnInit {

  @Input() value : number; 
  @Input() ultimo : number; 
  @Input() dato : string;
  @Input() parametro : string; 
  @Input() estacion : string;
  @Input() unidad : string;   

  selectedView = 'chart';

  factor : any;

  icon1 = '';
  icon2 = '';
  icon3 = '';
  icon4 = '';

  class1= '';
  class2= '';
  class3= '' ;
  class4= '' ;
  msg_outlier = '';

 



  public dinner = {
    mainCourse: 'fried chicken',
    desert: 'chocolate cake'
  };

  developers: Dev[];
  products: Observable<any[]>;
  estaciones: Observable<any[]>;
  programas: Observable<any[]>;
  equipos_caudal: Observable<any[]>;
  equipos_nivel: Observable<any[]>;
  equipos_multiparametro: Observable<any[]>;
  historicos: any[];
  progrmasdb: any[];
  chartOptions: any;
  title : any;
  titleyAxis; any ;
  valor_nivel : any;
  inputValue: string;
  register = {}
  form : any;

  max : any;
  min : any;
  avg : any;

  media : any;
  desviacion_estandar : any;
  outlier: any;

  public name : any;
  

  constructor(public modalController: ModalController,
    private db: DatabaseService, public params: NavParams,) { }

  ngOnInit(){

  
    console.log(this.value);
    console.log(this.estacion);
    console.log(this.parametro);
    this.setQuantity(this.value);


    console.log('ngOnInit');

   
  }

  ionViewDidEnter() {
    this.max='';
    this.min='';
    this.avg ='';
    this.media='';
    this.desviacion_estandar='';
    this.outlier='';

    console.log(this.value);
    console.log(this.estacion);
    console.log(this.parametro);
    this.setQuantity(this.value);


    console.log('ionViewDidEnter()');

    this.historicos = [];

    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {
     
        let parametro = this.parametro;
        let estacion = this.estacion;
        this.db.loadHistoricoQAQC(parametro.trim(), estacion.trim());    
          this.db.getHistoricoQAQC().subscribe((data) => {
          this.historicos= data;
          console.log(this.historicos)
          this.createChart(data);
       
        
        }, (err) => {
        console.log(err);
        
        }); 

          this.db.loadProm(estacion.trim(),parametro.trim()).then(data => { 

            console.log(data);
            this.getStatics(data);


          }) 

       
      }
    }); 

   //this.updateChart();
     
  }
  getStatics(data)
  {
    let avg;
    
    avg = data.avg;
    this.avg= avg.toFixed(2);
  }
  sortFloat(a,b) { return a - b; }

  createChart(data)
  {
    let arreglo = data;
    let multiData = [],
        i = 0;
    const valores = data.map(elemento => elemento[1]);
    const fechas = data.map(elemento => elemento[0]);
    let fecha_min = fechas[0];
    console.log(valores);
    console.log('media_calc :', this.calcularMedia(valores));
    console.log('desviacion_estandar :', this.calcularDesviacionEstandar(valores));
    console.log('valor a evaluar :', this.convertirtoFloat(this.value))
    this.media = this.dosDecimales(this.calcularMedia(valores));
    this.desviacion_estandar = this.dosDecimales(this.calcularDesviacionEstandar(valores));
    let valor = this.convertirtoFloat(this.value);
    this.outlier = this.esOutlier(valor, this.media, this.desviacion_estandar)
    console.log(this.outlier);
    if (this.outlier == false) {
        this.icon4 = 'thumbs-up-outline';
        this.class4 = 'primary';
        this.msg_outlier = `El valor de ${this.value} ${this.unidad} es normal y típico.`;
    } else {
        this.icon4 = 'thumbs-down-outline';
        this.class4 = 'error';
        this.msg_outlier = `El valor de ${this.value} ${this.unidad} es inusual o atípico.`;
    }
    console.log('cantidad de elementos', valores.length)
    let factor = this.value / this.ultimo;
    console.log('finite', isFinite(factor));
    console.log(factor);
    this.details(factor);
    this.historicos = data;
    if (this.parametro != 'ph') {
        var today = new Date();
        var today = new Date();
        var lim_inf = this.calcularMedia(valores) - (3 * this.calcularDesviacionEstandar(valores));
        var lim_sup = this.calcularMedia(valores) + (3 * this.calcularDesviacionEstandar(valores));
        let nameCapitalized = this.parametro.charAt(0).toUpperCase() + this.parametro.slice(1);
        this.title = this.estacion + " [" + nameCapitalized + "]";
        this.titleyAxis = nameCapitalized + ' [' + this.unidad + ']';
        
        let serie = [{
            name: 'LimSup',
            dashStyle: 'Dash',
            color: 'red',
            marker: {
                enabled: false
            },
            data: [
                [fecha_min, lim_sup],
                [this.convertIntoMili(), lim_sup]
            ]
        }, {
            name: 'LimInf',
            dashStyle: 'Dash',
            color: 'orange',
            marker: {
                enabled: false
            },
            data: [
                [fecha_min, lim_inf],
                [this.convertIntoMili(), lim_inf]
            ]
        }, {
            name: this.estacion + "[" + nameCapitalized + "]",
            color: '#38ff63',
            data: data,
            tooltip: {
                valueDecimals: 2,
                valueSuffix: this.unidad
            }
        }, {
            name: nameCapitalized + '[' + this.convertDate(today) + ' ' + this.convertTime() + ']',
            color: '#FF0000',
            data: [
                [this.convertIntoMili(), (this.value) * 1]
            ],
            marker: {
                symbol: 'circle'
            },
            tooltip: {
                valueDecimals: 2,
                valueSuffix: this.unidad
            }
        }];
        console.log(serie);
        this.ChartPopulation(serie);
    } else {
        var today = new Date();
        var lim_inf = this.calcularMedia(valores) - (3 * this.calcularDesviacionEstandar(valores));
        var lim_sup = this.calcularMedia(valores) + (3 * this.calcularDesviacionEstandar(valores));
        this.title = this.estacion + "[" + this.parametro + "]";
        this.titleyAxis = this.parametro + ' [' + this.unidad + ']';
        let serie = [{
            name: 'LimSup',
            dashStyle: 'Dash',
            color: 'red',
            marker: {
                enabled: false
            },
            data: [
                [fecha_min, lim_sup],
                [this.convertIntoMili(), lim_sup]
            ]
        }, {
            name: 'LimInf',
            dashStyle: 'Dash',
            color: 'orange',
            marker: {
                enabled: false
            },
            data: [
                [fecha_min, lim_inf],
                [this.convertIntoMili(), lim_inf]
            ]
        }, {
            name: this.estacion + " [" + this.parametro + "]",
            color: '#38ff63',
            data: data,
            tooltip: {
                valueDecimals: 2,
                valueSuffix: this.unidad
            }
        }, {
            name: this.parametro + '[' + this.convertDate(today) + ' ' + this.convertTime() + ']',
            color: '#FF0000',
            data: [
                [this.convertIntoMili(), (this.value) * 1]
            ],
            marker: {
                symbol: 'circle'
            },
            tooltip: {
                valueDecimals: 2,
                valueSuffix: this.unidad
            }
        }];
        console.log(serie);
        this.ChartPopulation(serie);
    }
}

  dosDecimales(numero) {
    return parseFloat(numero.toFixed(2));
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

  convertirtoFloat(valorString) {
    // Utiliza parseFloat para convertir el valor de cadena a float
    const valorFloat = parseFloat(valorString);
  
    // Verifica si la conversión fue exitosa
    if (isNaN(valorFloat)) {
      console.error(`No se pudo convertir "${valorString}" a un número flotante.`);
      return NaN; // o puedes devolver algún valor predeterminado según tus necesidades
    }
  
    return valorFloat;
  }

  esOutlier(valor, media, desviacionEstandar, umbralZ = 3.0) {
    const zScore = Math.abs((valor - media) / desviacionEstandar);
  
    return zScore > umbralZ;
  }

  details(factor)
  {

    if (isFinite(factor)==false)
    {
      
     this.icon1='checkmark-circle-outline';
     this.class1='primary'; 
     this.icon2='checkmark-circle-outline';
     this.class2='primary'; 
     this.icon3='checkmark-circle-outline';
     this.class3='primary';
     this.factor ='SD';
 
    }
    else
    {
      
         
 
     if((factor<0.90)||(factor>1.10))
     { 
        
 
           this.icon1='close-circle-outline';
           this.class1='error'
           console.log('pinta rojo c1');
           
     }
     else
     {
          this.icon1='checkmark-circle-outline';
          this.class1='primary'
          console.log('pinta verde c1')
 
     }
 
     if((factor<0.83)||(factor>1.20))
     { 
          
         console.log('pinta rojo c2');
           this.icon2='close-circle-outline';
           this.class2='error'
           
     }
     else
     {
 
       this.icon2='checkmark-circle-outline';
       this.class2='primary';
       console.log('pinta verde c2');
       
 
     }
 
     
     if((factor<0.66)||(factor>1.5))
     { 
         
 
           this.icon3='close-circle-outline';
           this.class3='error' 
           console.log('pinta rojo c2');
           
     }
     else
     {
         this.icon3='checkmark-circle-outline';
         this.class3='primary';
          console.log('pinta verde c2');
      
 
     }
 
 
     this.factor = factor.toFixed(2);
      
    }

  }

  ionChangeValor(event,parameter)
  {
    console.log(event.detail.value);
    console.log(parameter);
    let valueInsert = event.detail.value;

    let factor =valueInsert / this.ultimo;

   console.log('finite',isFinite(factor));
   console.log(factor);

  if (isFinite(factor)==false)
  {
    
   this.icon1='checkmark-circle-outline';
   this.class1='primary'

   this.icon2='checkmark-circle-outline';
   this.class2='primary';

   this.icon3='checkmark-circle-outline';
   this.class3='primary';

   
   this.factor ='Sin Datos';

  }
  else
  {
    
       

   if((factor<0.5)||(factor>2))
   { 
      

         this.icon1='close-circle-outline';
         this.class1='error'
         console.log('pinta rojo c1');
         
   }
   else
   {
        this.icon1='checkmark-circle-outline';
        this.class1='primary'
        console.log('pinta verde c1')

   }

   if((factor<0.2)||(factor>5))
   { 
        
       console.log('pinta rojo c2');
         this.icon2='close-circle-outline';
         this.class2='error'
         
   }
   else
   {

     this.icon2='checkmark-circle-outline';
     this.class2='primary';
     console.log('pinta verde c2');
     

   }

   
   if((factor<0.1)||(factor>10))
   { 
       

         this.icon3='close-circle-outline';
         this.class3='error' 
         console.log('pinta rojo c2');
         
   }
   else
   {
       this.icon3='checkmark-circle-outline';
       this.class3='primary';
        console.log('pinta verde c2');
    

   }


   this.factor = factor.toFixed(2);
    
  }

    this.dato='6';
    console.log(this.dato);
    console.log(this.value);
    console.log('hi');
    var today = new Date();
    let nameCapitalized = this.parametro.charAt(0).toUpperCase() + this.parametro.slice(1);

    var character = {
        'name': this.name,
        'discount': false,        
        'opt': false, 
      };
      let serie = [{name:this.estacion+"["+nameCapitalized+"]",color :'#38ff63' ,data: this.historicos},{name:nameCapitalized+'['+this.convertDate(today)+' '+this.convertTime()+']',marker: {symbol: 'circle'}  ,  color: '#FF0000',data: [[this.convertIntoMili(),(valueInsert)*1]]}]; 
     //let serie = [{name:this.estacion+"["+nameCapitalized+"]",color :'#38ff63' ,data: this.historicos},{name:nameCapitalized+'['+today+']', color: '#FF0000',data: [[this.convertIntoMili(),this.value]]}]; 
     //let serie = [{name:'Serie 1',color :'#38ff63' ,data: this.historicos},{name:'Serie 2', color: '#FF0000',data: [[this.convertIntoMili(),(this.name)*1]]}]; 
      console.log(serie);
      let empty = [];
      //this.ChartPopulation(empty);
      this.ChartPopulation(serie);
      console.log(character); 
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

  convertIntoMili()
  {   

    let miliseconds = new Date().getTime();
    return(miliseconds);

  }
  exitModal(){

    this.modalController.dismiss();

    this.modalController.dismiss({
      'dismissed': true
    });
    
  }

  setQuantity(value)
  {
  
      this.name = value;
  
  }

  updateChart()
  {
  
   // boton de actualizar los graficos //
   // this.setQuantity(this.value);
   console.log(this.name);
   let factor = this.name / this.ultimo;

   console.log('finite',isFinite(factor));
   console.log(factor);
   this.details(factor);

    this.dato='6';
    console.log(this.dato);
    console.log(this.value);
    
    console.log('hi');
    var today = new Date();
    let nameCapitalized = this.parametro.charAt(0).toUpperCase() + this.parametro.slice(1);

    var character = {
        'name': this.name,
        'discount': false,        
        'opt': false,
      };
      let serie = [
        {
          name: this.estacion + "[" + nameCapitalized + "]",
          color: '#38ff63',
          data: this.historicos,
         
        },
        {
          name: nameCapitalized + '[' + this.convertDate(today) + ' ' + this.convertTime() + ']',
          color: '#FF0000',
          data: [[this.convertIntoMili(), this.name * 1]],
          marker: {
            symbol: 'circle', // Símbolo de círculo
          },
        },
      ];

      let arreglo =this.historicos;
      let multiData=[],i=0; 
    
      for (let entry of arreglo)
      {         
          multiData.push(entry[1]);    
        
      }
      multiData.sort(this.sortFloat) ;


      let result = multiData.filter((item,index)=>
      {
        return  multiData.indexOf(item) === index;
      });

      console.log('cleaning',result);
      console.log('ord_min',result[0]);
      console.log('ord_max',result[result.length-1]);
      console.log('media_calc :',this.calcularMedia(result)); 
      console.log('desviacion_estandar :',this.calcularDesviacionEstandar(result));
      console.log('valor a evaluar :', this.convertirtoFloat(this.value));  

      this.media = this.dosDecimales(this.calcularMedia(result));
      this.desviacion_estandar = this.dosDecimales(this.calcularDesviacionEstandar(result));
      let valor = this.convertirtoFloat(this.value);
      this.outlier =   this.esOutlier(valor,this.media,this.desviacion_estandar)
      console.log(this.outlier);
      this.max =  result[result.length-1]  ;
      this.min = result[0];
      console.log(serie);
      let empty = [];  
      this.ChartPopulation(serie);
      console.log(character); 
  }



  ChartPopulation(data) {    

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

  this.chartOptions = HighCharts.chart('highcharts_result', {
        chart: {
          backgroundColor: 'transparent',
          type: 'line', 
          zoomType: 'x',     
       
        },
        title: {
          text: this.title,
          style: {
            color: '#9a9ca8',
            font: '11px "nuni-black", sans-serif',
        }
        },
        xAxis: {

          type: 'datetime',
          gridLineWidth: 1,
          gridLineDashStyle: 'Dash', //
          gridLineColor: 'grey',
          
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
        yAxis: [    {
          title: {
              text: this.titleyAxis,
              style: {
                 font: '10px "nuni-black", sans-serif',
                  color: 'grey'
              },
          },
          gridLineWidth: 1,
          gridLineDashStyle: 'Dash', //
          gridLineColor: 'grey',
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
ionViewDidLeave(){

  console.log('bye');

}

  

}


