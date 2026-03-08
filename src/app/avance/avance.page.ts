import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { DatabaseService, Dev, Markers } from '../services/database.service';
import { Observable, of } from 'rxjs';
import * as HighCharts from 'highcharts';
import NoDataToDisplay from 'highcharts/modules/no-data-to-display';
import HC_exporting from 'highcharts/modules/exporting';
import HC_exportData from 'highcharts/modules/export-data';
import * as Highcharts from 'highcharts';
import { LoadingController } from '@ionic/angular';
import * as L from 'leaflet';
@Component({
  selector: 'app-avance',
  templateUrl: './avance.page.html',
  styleUrls: ['./avance.page.scss'],
})
export class AvancePage implements OnInit {

  @ViewChild('map') mapContainer: ElementRef;

  leafletMap: any;
  markerGroup: any;
  id_programa= '';
  Markers  : any

  programas: Observable < any[] > ;
  chartOptions: any;

  constructor(private db: DatabaseService,public loadingController: LoadingController, private alertController: AlertController) { }

  ngOnInit()
  {
    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy)
      {
        
             this.programas = this.db.getProgramas();
        
      }
  });

   
  }
  ngAfterViewInit()
  {

  
  this.loadLeafletMap();
  }

  async getMarkers(id_programa) {
    console.log(id_programa);

    // Muestra el loading controller
    const loading = await this.loadingController.create({
        message: 'Cargando marcadores...'
    });
    await loading.present();

    this.db.loadlocations(id_programa).then(data => {
        console.log(data);
        this.Markers = data;
        // Verifica si hay marcadores
        if (this.Markers.length === 0) {
            // Si no hay marcadores, muestra un alert
            this.presentNoDataAlert();
        } else {
            // Si hay marcadores, llama a processMarkers() para procesarlos
            this.processMarkers(this.Markers);
        }
        // Descartar el loading controller una vez que los marcadores se han procesado o se ha mostrado el alert
        loading.dismiss();
    }).catch(error => {
        console.error('Error al cargar los marcadores:', error);
        // Descartar el loading controller en caso de error
        loading.dismiss();
    });
}

async presentNoDataAlert() {
    const alert = await this.alertController.create({
        header: 'Alerta',
        message: 'No hay información de la campaña.',
        buttons: ['OK']
    });
    await alert.present();
}

  async processMarkers(markers: any[]) {


    console.log('programa_st:',markers)
    var nodata = L.divIcon({
        className: 'nodata',
        iconSize: [8, 8],
        iconAnchor: [20, 20],
        popupAnchor: [-15, -20],
    });
    var data = L.divIcon({
      className: 'data',
      iconSize: [8, 8],
      iconAnchor: [20, 20],
      popupAnchor: [-15, -20],
  });
  var indivice = L.divIcon({
    className: 'indivice',
    iconSize: [8, 8],
    iconAnchor: [20, 20],
    popupAnchor: [-15, -20],
});

    var createLabelIcon = function(labelClass, labelText) {
      return L.divIcon({
        className: labelClass,
        html: labelText,
        iconSize: [51, 51],
        iconAnchor: [37, 15],
        popupAnchor: [1, -34],
      })
    };

    // Borrar los marcadores existentes si es que hay alguno
    if (this.markerGroup) {
        this.markerGroup.clearLayers();
    } else {
        this.markerGroup = L.featureGroup().addTo(this.leafletMap);
    }

    markers.forEach(marker => {
      const { latitud, longitud, nombre, checked } = marker;
      const markerLocation = L.latLng(latitud, longitud);
      let icon;
  
    

      if (checked==null) {
        icon = nodata;
    } else if (checked == 'true') {
        icon = data;
    } else {
        icon = indivice;
    }
  
      // Agregar marcador con el icono correspondiente
      L.marker(markerLocation, { icon: icon }).addTo(this.leafletMap);


        var nombres = new L.Marker(new L.latLng([latitud, longitud]), {
          icon: createLabelIcon('labelClass_red', nombre)
        }).addTo(this.leafletMap);     
    });

    const minLat = Math.min(...markers.map(marker => marker.latitud));
    const maxLat = Math.max(...markers.map(marker => marker.latitud));
    const minLng = Math.min(...markers.map(marker => marker.longitud));
    const maxLng = Math.max(...markers.map(marker => marker.longitud));

    const lat = (minLat + maxLat) / 2;
    const lng = (minLng + maxLng) / 2;

    const newCenter = new L.LatLng(lat, lng);

    // Establecer la nueva vista del mapa
    this.leafletMap.setView(newCenter, 13);
    this.fitAllMarkers(this.leafletMap,markers);
}

fitAllMarkers(map: any, markers: any[]) {
  const markerGroup = new L.FeatureGroup();

  for (let i = 0; i < markers.length; i++) {
    const marker = L.marker([markers[i].latitud, markers[i].longitud]);
    markerGroup.addLayer(marker);

    
  }

  const padding = 0.005; // Valor de "padding" fijo (ajusta según tus necesidades)

  if (markers.length === 1) {
    // Si hay solo un marcador, aumenta el zoom (ajusta según tus necesidades)
    map.setView([markers[0].latitud, markers[0].longitud], 13);
  } else {
    // Si hay más de un marcador, ajusta los límites con "fitBounds"
    map.fitBounds(markerGroup.getBounds().pad(padding));
  }
}


  async loadLeafletMap(): Promise<void> {
    const mapElement = this.mapContainer.nativeElement;
  
    // Muestra el loading controller
    const loading = await this.loadingController.create({
      message: 'Cargando mapa...'
    });
    await loading.present();
  
    if (!this.leafletMap) {
      this.leafletMap = new L.Map(mapElement, {
        zoomControl: false
      });
  
      const self = this;
  
      this.leafletMap.on("load", function () {
        setTimeout(() => {
          self.leafletMap.invalidateSize();
          loading.dismiss(); // Oculta el loading controller una vez que el mapa se ha cargado
        }, 10);
      });
  
    
      this.leafletMap.setView([-33.4225552,-70.608966], 13);


      L.control.zoom({
        position: 'bottomleft'
      }).addTo(this.leafletMap);


      var capaBase1 = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
     maxZoom: 19,
     attribution: false
   });
   
   var capaBase2 = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
     maxZoom: 19,
     attribution: false
   });

  var mbUrl1 = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
   

  var  streets = L.tileLayer(mbUrl1, {
    id: 'mapbox/streets-v11',
    attribution: false
  });
  
  // Crear un objeto de capas
  var capas = {
    "Mapa": capaBase1,
    "Carreteras": capaBase2,
    "Satélite": streets
  };
  
  
  L.control.layers(capas, null, { position: 'topright' }).addTo(this.leafletMap);

  
      // Agrega el layer del mapa con un manejo de error
      L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(this.leafletMap).on('error', function (e) {
        loading.dismiss(); // Oculta el loading controller
        mapElement.innerText = 'Ocurrió un error al cargar el mapa'; // Muestra un mensaje de error en el div #map
      });
    } else {
      loading.dismiss(); // Oculta el loading controller si el mapa ya está inicializado
    }


  }
  
  


  

    /*const datosEjemplo = [
      { name: 'Categoría 1', y: 25 },
      { name: 'Categoría 2', y: 35 },
      { name: 'Categoría 3', y: 40 }
    ];
    
    this.AnilloChart(datosEjemplo, 'Gráfico de Anillo Ejemplo');

    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy)
      {       
 
          this.programas = this.db.getProgramas();
     
      }
  });*/
  

  AnilloChart(data: any[], name: string) {
    // Configuración de colores
    var colores = ['#FF5733', '#33FF57', '#334CFF', '#FFD733', '#FF33E8', '#33FFE6'];
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

  this.chartOptions = HighCharts.chart('donutChart', {
    chart: {
      type: 'pie',
      
      
    },
    responsive: {
      rules: [{
        condition: {
          maxWidth: 500 // Cambia el tamaño máximo según tus necesidades
        },
        chartOptions: {
          legend: {
            enabled: false
          },
          plotOptions: {
            pie: {
              dataLabels: {
                enabled: false
              }
            }
          }
        }
      }]
    },
    title: {
      text: name,
      style: {
        fontFamily: 'Roboto, sans-serif',
        fontWeight: 'bold'
      }
    },
    plotOptions: {
      pie: {
        innerSize: '70%', // Esto crea el efecto de anillo
        dataLabels: {
          enabled: true, // Activa las etiquetas de datos
          style: {
            fontSize: '12px',
            fontFamily: 'Roboto, sans-serif'
          }
        }
      }
    },
    legend: {
      enabled: true // Activa la leyenda
    },
    tooltip: {
      headerFormat: '',
      pointFormat: '{point.name}: <b>{point.percentage:.1f}%</b>',
      style: {
        fontSize: '12px',
        fontFamily: 'Roboto, sans-serif'
      }
    },
    exporting: {
      enabled: false // Deshabilita la funcionalidad de exportación
    },
    credits: {
      enabled: false // Deshabilita los créditos
    },
    colors: colores, // Agrega el array de colores aquí
    series: [{
      type: 'pie',  // Específica el tipo de serie aquí
      name: 'Porcentaje',
      data: data
    }],
   
  });

 



  
    // Configuración de Highcharts para el gráfico de anillo
  
  

  

}
}
