import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseService , Dev } from '../services/database.service';
import { NavController, LoadingController, AlertController, ToastController } from '@ionic/angular';
import { Observable, of } from 'rxjs';
import { HttpClient,HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { DNS } from '@ionic-native/dns/ngx';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { finalize } from 'rxjs/operators';


interface ApiResponse {
    data: {
      estacion: string;
      id: number;
      programId: number;
    }[];
  };

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.page.html',
  styleUrls: ['./feedback.page.scss'],
})



export class FeedbackPage implements OnInit {

  developers: Dev[] = [];
  products: Observable < any[] > ;
  ultima: Observable < any[] > ;
  developer = {};
  product = {};
  id_estacion: any;
  programas: Observable < any[] > ;
  selectedView = 'devs';
  estatus = {
      'dns': '',
      'class': '',
      'icon': ''
  };
  textToDisplay: string = '';
  estaciones: Observable < any[] > ;
  estaciones_array: any[];
  selectAll: true;
  id_programa_act = '';
  isChecked: boolean = false;

 

  constructor(private db: DatabaseService,
      private http: HttpClient,
      public loadingController: LoadingController,
      private toastController: ToastController,
      private dns: DNS,
      public alertController: AlertController, ) {}

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
  ionViewWillEnter() {
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
              this.MessageToast('Updating...', 'dark')

          } else {
              event.target.complete();
              this.MessageToast('No se pudo establecer conexion a la base de datos...', 'danger')

          }


      });




  }


  actualizarEstaciones(programa) {
    // Limpiar this.estaciones
    this.estaciones = of([]);
    this.id_estacion = [];
  
    // Obtener las nuevas estaciones
    this.db.ComboEstaciones(programa).then(data => { 
      console.log('proms=>', data);
      // Asignar los nuevos datos a this.estaciones
      this.estaciones = of(data);
    });
    this.textToDisplay = "(" + this.id_estacion.length + ")";
    this.isChecked= false;
  }


 


  uncheck(event)
  {
    console.log(event.detail.checked);
  
    let eventReceived = event.detail.checked;
  
    if (eventReceived == true) {
      this.id_estacion = [];
  
      this.estaciones.subscribe(estacionesData => {
        for (let entry of estacionesData) {
          this.id_estacion.push(entry.name);
        }
      });
    } else {
      this.id_estacion = [];
      this.isChecked= false;
    }
  }

  onSelectChange(selectedValue: any)
  {
      this.textToDisplay = "(" + this.id_estacion.length + ")";
      console.log('text', this.textToDisplay);

  }


  async showAlert(programsCount: number, data): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Actualización',
      message: ` ${programsCount} programas encontrados ¿Desea Actualizar? `,
      buttons: [
        {
          text: 'Aceptar',
          cssClass: 'custom-primary-outline',
          handler: () => {
            // Lógica cuando se hace clic en Aceptar
            this.processPrograma(data);
             this.presentToast('Actualización finalizada');            
           
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            // Lógica cuando se hace clic en Cancelar
            console.log('Cancelar clicado');
            this.presentToast('Se descarta actualización');
          }
        }
      ]
    });
  
    await alert.present();
  }

  async presentToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000, // duración del Toast en milisegundos
      position: 'bottom' // posición del Toast en la pantalla ('top', 'bottom', 'middle')
    });
  
    await toast.present();
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

  resolveDNS() {
      let msj = '';
      console.log('Resolving DNS');
      let hostname = 'www.gpconsultores.cl';
      this.dns.resolve(hostname)
          .then(
              address => this.SuccesmessageDNS(),
              error => this.ErrormessageDNS(),
          );
  }
  async SuccesmessageDNS() {

      this.estatus.class = 'success';
      this.estatus.dns = 'ok';
      this.estatus.icon = 'checkmark-outline';

      const toast = await this.toastController.create({
          message: 'Acceso a servidor verificado',
          duration: 2000
      });
      toast.present();

  }


  async ErrormessageDNS() {

      this.estatus.class = 'danger';
      this.estatus.dns = 'ok';
      this.estatus.icon = 'close-outline';


      const alert = await this.alertController.create({


          header: 'Conexión a servidor',
          subHeader: '',
          message: 'No se ha logrado establecer conexión con servidor.',
          buttons: [{
              text: 'Ok',
              role: 'cancel',
              cssClass: 'secondary',
              handler: () => {
                  console.log('Confirm Ok');

              }
          }]
      });

      await alert.present();
  }


  async dataSavedResolved()
  {
      const toast = await this.toastController.create({
          message: 'Histórico actualizado',
          duration: 2000,
          color: 'primary'
      });
      toast.present();
  }


  async saveDataConfirm() {
      let msg;
      if (this.id_estacion.length == 1) {

          msg = '¿Actualizar histórico en ' + this.id_estacion + '  ?';
      }
      if (this.id_estacion.length > 1) {
          msg = '¿Actualizar histórico en ' + this.id_estacion.length + ' estaciones ?';
      }
      const alert = await this.alertController.create({
          cssClass: 'my-custom-class',
          header: 'Descarga de Datos',
          message: msg,
          buttons: [{
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
          }]
      });
      await alert.present();
  }

  async getEstacionId() {



      if (this.estatus.dns == 'error') {

          this.ErrormessageDNS();

      } else {
          if (this.id_estacion == undefined) {
              console.log('error');
              this.presentAlerterror()
          } else {
              this.saveDataConfirm();
          }

      }

  }
  
  async savingData(estaciones)
  {
    let response;
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Descargando desde servidor...',
      spinner: 'circles',
    });
  
    let programa = this.id_programa_act; 
  
    try {
      await loading.present();
  
      const data = await new Promise<{ msg: number; data: any[] }>((resolve, reject) => {
        this.http.post('https://www.gpconsultores.cl/apicollector/extract_data.php', {
          estaciones,
          programa
        }, {
          responseType: 'json'
        }).subscribe((data: { msg: number; data: any[] }) => {
          console.log(data);
          resolve(data);
        }, error => {
          // Manejar errores aquí
          console.error('Ocurrió un error', error);
          alert('Ocurrió un error');
          reject(error);
        });
      });
  
      // Verifica si la propiedad "data" está vacía
      if (Array.isArray(data.data) && data.data.length === 0) {
        this.showNoDataAlert();
      } else {
        await this.processData(data);
      }
  
    } catch (error) {
      // Manejar errores aquí
      console.error('Ocurrió un error', error);
      alert('Ocurrió un error');
    } finally {
      await loading.dismiss();
      this.dataSavedResolved();
    }
  }
  
  async showNoDataAlert()
  {
    const alert = await this.alertController.create({
      header: 'Sin Datos',
      message: 'No se encontraron datos para procesar.',
      buttons: ['OK']
    });
  
    await alert.present();
  }
  async dataEmpty() {

      const alert = await this.alertController.create({
          cssClass: 'my-custom-class',
          header: 'Sin datos',
          message: 'No se puede actualizar histórico.',
          buttons: [{
              text: 'Aceptar',
              role: 'cancel',
              cssClass: 'secondary',
              handler: (blah) => {
                  console.log('Confirm Cancel: blah');
              }
          }]
      });

      await alert.present();

  }
  processData(data) {

      let respuestaServer = data;
      console.log(respuestaServer.data);
      if (respuestaServer.data == null) {
          //this.dataEmpty();
          console.log('empty');

      } else {

          for (let entry of respuestaServer.data) {
              this.db.addHistorico(entry.fecha, entry.certificado, entry.estacion, entry.nivel, entry.caudal, entry.ph, entry.temperatura, entry.conductividad, entry.oxigeno, entry.turbiedad, entry.SDT);

          }
          // loading.dismiss();  
          //this.db.loadUpdates();

      }

  }


 

  private showProgramSelectionAlert() {
    this.alertController.create({
      header: 'Alerta',
      message: 'Debe seleccionar un programa antes de realizar la solicitud.',
      buttons: ['Aceptar']
    }).then(alert => alert.present());
  }

  async httpStations() {
    const loading = await this.loadingController.create({
        message: 'Cargando...',
        spinner: 'circles' // Puedes cambiar 'circles' por el tipo de spinner que desees
    });
    if (!this.id_programa_act || this.id_programa_act.trim() === '') {
        // Mostrar alerta indicando que se debe seleccionar un programa
        this.showProgramSelectionAlert();
    } else {
        // Si no es nulo o vacío, realizar la solicitud HTTP
        // Definir el objeto JSON
        const requestData = {
            programa: this.id_programa_act
        };
        await loading.present();
        this.http.post < ApiResponse > ('https://gpconsultores.cl/apicollector/exponer_estaciones.php', requestData, {
            responseType: 'json'
        }).subscribe(
            async response => {
                    if (response && response.data && Array.isArray(response.data) && response.data.length > 0) {
                        console.log('Respuesta válida:', response.data);
                        const estacionesCount = response.data.length;
                        const alert = await this.alertController.create({
                            header: 'Estaciones Encontradas',
                            message: `Se encontraron ${estacionesCount} estaciones asociadas al programa seleccionado. ¿Desea almacenar la información en el dispositivo?`,
                            buttons: [{
                                    text: 'Aceptar',
                                    handler: async () => {
                                        //console.log('Aceptar clicado');
                                        //this.processEstaciones(response.data);
                                        const loading = await this.loadingController.create({
                                            message: 'Procesando estaciones...'
                                        });
                                        await loading.present();
                                        try {
                                            // Ejecutar la lógica de procesamiento de estaciones
                                            await this.processEstaciones(response.data);
                                        } catch (error) {
                                            console.error('Error al procesar estaciones:', error);
                                            // Manejar el error según sea necesario
                                        } finally {
                                            // Ocultar el LoadingController al finalizar, independientemente de si hay un error o no
                                            loading.dismiss();
                                        }
                                    }
                                },
                                {
                                    text: 'Cancelar',
                                    role: 'cancel',
                                    handler: () => {
                                        // Lógica cuando se hace clic en Cancelar
                                        console.log('Cancelar clicado');
                                    }
                                }
                            ]
                        });
                        await alert.present();
                        //this.processEstaciones(response.data);
                    } else {
                        // La propiedad 'data' no existe o tiene 0 elementos
                        console.error('La respuesta no es válida:', response);
                        const errorAlert = await this.alertController.create({
                            header: 'Error',
                            message: 'La respuesta no es válida o no se encontraron estaciones asociadas al programa seleccionado.',
                            buttons: ['Aceptar']
                        });
                        await errorAlert.present();
                        // Puedes mostrar una alerta o realizar alguna otra acción en consecuencia
                    }
                    // Ocultar el loading controller
                    loading.dismiss();
                },
                error => {
                    console.error('Error al hacer la solicitud:', error);
                    // También ocultar el loading controller en caso de error
                    loading.dismiss();
                }
        );
    }
}
  processEstaciones(data) {
      for (let entry of data) {
          console.log(entry.estacion, entry.id,entry.programId,entry.latitud, entry.longitud);
          this.db.WSaddEstaciones(entry.estacion,entry.programId, entry.id,entry.latitud,entry.longitud);
      }

  }

  processPrograma(data) {
      
    for (let entry of data)
      {
          console.log(entry);
          this.db.addPrograma(entry.nombre, entry.id)

      }

  }

  processProgramaMonitoreo(data) {

      for (let entry of data) {

          this.db.addProgramaMonitoreo(entry.uniq_id, entry.programa, entry.id_estacion, entry.nivel_programa, entry.caudal_programa, entry.ph_programa, entry.temperatura, entry.conductividad_programa, entry.oxigeno_programa, entry.turbiedad_programa, entry.sdt_programa);
          console.log("insert->", entry)
      }

  }
  async MessageToast(msg, color) {
      const toast = await this.toastController.create({
          message: msg,
          duration: 2000,
          color: color
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


  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      console.error('Error del lado del cliente:', error.error.message);
    } else {
      // El servidor retornó un código de error
      console.error(
        `Error del lado del servidor - Código: ${error.status}, Mensaje: ${error.message}`
      );
    }
    // Devuelve un observable con un mensaje de error para que lo maneje el componente que hizo la llamada
    return throwError('Ocurrió un error al procesar la solicitud. Por favor, inténtalo de nuevo más tarde.');
  }

  async updatePrograms() {



      const loading = await this.loadingController.create({
          cssClass: 'my-custom-class',
          message: 'Descargando desde servidor...',
          spinner: 'bubbles',

      });


      if (this.estatus.dns == 'error') {

          this.ErrormessageDNS();

      } else {

          this.http.post('https://www.gpconsultores.cl/api_rest/get_primary_program.php', {
              responseType: 'json'
          }).subscribe(data => {
              console.log(data);
              this.processPrograma(data);

          });

          loading.dismiss();




      }




  }
  get_programa()
  {
    let url = 'https://www.gpconsultores.cl/apicollector/exponer_programas.php';
     this.http.post(url, { responseType: 'json' }).pipe(
        catchError(this.handleError)
      ).subscribe((data: any) => {
        console.log(data);
        //this.processPrograma(data);
        if (data.length > 1) {
            this.showAlert(data.length,data);
          }

      });
    
}


async presentPasswordPrompt2() {
    const alert = await this.alertController.create({
      header: 'Ingrese password para conectar a WebService',
      inputs: [
        {
          name: 'password',
          type: 'password',
          placeholder: 'Contraseña'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancelar');
          }
        },
        {
          text: 'Aceptar',
          handler: (data) => {
            if (data.password === 'gp292021')
            {
                let url = 'https://www.gpconsultores.cl/apicollector/exponer_programas.php';
                this.http.post(url, { responseType: 'json' }).pipe(
                   catchError(this.handleError)
                 ).subscribe((data: any) => {
                   console.log(data);
                   //this.processPrograma(data);
                   if (data.length > 1) {
                       this.showAlert(data.length,data);
                     }
           
                 });
               
            } else {
              console.log('Contraseña incorrecta');
              // Puedes mostrar un mensaje de error al usuario si la contraseña es incorrecta.
            }
          }
        }
      ]
    });  
    await alert.present();
  }

async presentPasswordPrompt1() {
    const alert = await this.alertController.create({
      header: 'Ingrese password para conectar a WebService',
      inputs: [
        {
          name: 'password',
          type: 'password',
          placeholder: 'Contraseña'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancelar');
          }
        },
        {
          text: 'Aceptar',
          handler: (data) => {
            if (data.password === 'gp292021')
            {
                let url = 'https://www.gpconsultores.cl/apicollector/exponer_programas.php';
                this.http.post(url, { responseType: 'json' }).pipe(
                   catchError(this.handleError)
                 ).subscribe((data: any) => {
                   console.log(data);
                   //this.processPrograma(data);
                   if (data.length > 1) {
                       this.showAlert(data.length,data);
                     }
           
                 });
               
            } else {
              console.log('Contraseña incorrecta');
              // Puedes mostrar un mensaje de error al usuario si la contraseña es incorrecta.
            }
          }
        }
      ]
    });  
    await alert.present();
  }

async presentPasswordPrompt() {
    const alert = await this.alertController.create({
      header: 'Ingrese password para conectar a WebService',
      inputs: [
        {
          name: 'password',
          type: 'password',
          placeholder: 'Contraseña'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancelar');
          }
        },
        {
          text: 'Aceptar',
          handler: (data) => {
            if (data.password === 'gp292021')
            {
                let url = 'https://www.gpconsultores.cl/apicollector/exponer_programas.php';
                this.http.post(url, { responseType: 'json' }).pipe(
                   catchError(this.handleError)
                 ).subscribe((data: any) => {
                   console.log(data);
                   //this.processPrograma(data);
                   if (data.length > 1) {
                       this.showAlert(data.length,data);
                     }
           
                 });
               
            } else {
              console.log('Contraseña incorrecta');
              // Puedes mostrar un mensaje de error al usuario si la contraseña es incorrecta.
            }
          }
        }
      ]
    });  
    await alert.present();
  }
}

