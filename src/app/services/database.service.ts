import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { HttpClient } from '@angular/common/http';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { BehaviorSubject, Observable } from 'rxjs';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { StringMap } from '@angular/compiler/src/compiler_facade_interface';


const resum: Resum = {
  data_nivel: [],
  data_caudal: [],
  data_temp: [],
  data_ph: [],
  data_ce: [],
  data_ox: [],
  data_turbiedad: [],
  data_sdt: [],
  totalElementos : 0
};

 
export interface Serv {
  id: number,
  serverip: string,
  dateserver:string,
 
}

export interface Users {
 
  id: number,
  nombre: string,
  apellido:string,
  rut: string
 
}

export interface Prom {
  max: string,
  min: string,
  avg: string,
 
}


export interface Control {

  nombre: string,
  id: string,
  programa: string

}

export interface Markers {

  nombre: string,
  id: string,
  programa: string,
  latitud : any,
  longitud: any,
  checked : any


}

export interface Combo {
  
   id: number,
   name: string,
   programa: string 
}


export interface lista {
  
  id: number,
  name: string,
  programa: string 
}


export interface Dev {
  id: number,
  name: string,
  skills: any[],
  img: string
}

export interface Mnt {
  id: number,
  programa: string,
  estacion: string,
  equipo_nivel : string,
  valor_nivel : string,
  equipo_caudal: string,
  valor_caudal: string,
  equipo_multiparametro: string,
  valor_temperatura: string,
  valor_ph: string,
  valor_conductividad: string,
  valor_oxigeno: string,
  equipo_turbiedad: string,
  valor_turbiedad: string,
  hora: string,
  fecha: string,
  latitud : string,
  longitud: string,
  observacion: string,
  id_laboratorio: string,
  inspector:  string,
  profundidad: string,
  metodo: string,
  tipo_agua: string,
  tipo_nivel: string,
  hora_nivel: string,
  hidroquimico: string,
  isotopico: string,
  fallido: string


}


export interface Chart {
  value: number,
  date: string
 
}


export interface QAQC { 
 
 
  estacion: string, 
  elementos: string,
  valor_nivel : string, 
  valor_caudal: string, 
  valor_temperatura: string,
  valor_ph: string,
  valor_conductividad: string,
  valor_oxigeno: string,
  valor_turbiedad: string,
  valor_sdt: string,
  varianza_ce : string,
  varianza_ph : string, 
  varianza_ox : string,
  varianza_temp: string, 
  varianza_turbiedad : string ,  
  varianza_nivel: string,
  varianza_sdt: string,
  varianza_caudal: string,



  

}


export interface Resum { 
  
 
  data_ce : number[],
  data_ph : number[], 
  data_ox : number[],
  data_temp: number[], 
  data_turbiedad : number[],  
  data_nivel: number[],
  data_sdt: number[],
  data_caudal: number[],
  totalElementos: number
  


}
 
@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private database: SQLiteObject;
  private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);
 
  developers = new BehaviorSubject([]);
  estaciones = new BehaviorSubject([]);
  parametros = new BehaviorSubject([]);
  products = new BehaviorSubject([]);
  programas = new BehaviorSubject([]);
  monitoreos = new BehaviorSubject([]);
  monitoreos_pendientes =  new BehaviorSubject([]);
  monitoreos_enviados =  new BehaviorSubject([]);
  ultimas =  new  BehaviorSubject([]);
  dataChart = new  BehaviorSubject([]);
  puntos = new BehaviorSubject([]);
 

  equipos_caudal = new BehaviorSubject([]);
  equipos_nivel = new BehaviorSubject([]);
  equipos_multiparametro = new BehaviorSubject([]);
  equipo_turbidiometro = new BehaviorSubject([]);
  historicosp = new BehaviorSubject([]);
  historicosQAQC = new BehaviorSubject([]);
  actualizaciones = new BehaviorSubject([]);
  usuarios =  new BehaviorSubject([]);
  progrmas_array : any;
  configSend='false';


 
  constructor(
    private backgroundMode: BackgroundMode,private plt: Platform,private sqlitePorter: SQLitePorter, private sqlite: SQLite, private http: HttpClient) {
    this.plt.ready().then(() => {
      this.sqlite.create({
        name: 'monitoreo_rev1.47.db',
        location: 'default'
      })
      .then((db: SQLiteObject) => {
          this.database = db;
          this.seedDatabase();
      });
    });
  }


  
 
 seedDatabase() {
   
    let i=0;

  

      this.http.get('assets/seed.sql', { responseType: 'text'})
      .subscribe(sql => {
        this.sqlitePorter.importSqlToDb(this.database, sql)
          .then(_ => {
            this.loadDevelopers();
            this.loadStations();
            this.loadProgramas();
            this.loadEquipoCaudal();
            this.loadEquipoNivel();
            this.loadEquipoMultiparametro();
            this.loadMonitoreos();
            this.loadMonitoreoPending();
            this.loadMonitoreoSending();
            this.loadParameters();
            this.loadUpdates();
            this.loadUsuarios();
            //this.loadQaqc();
            //this.loadHistorico();
  
            this.dbReady.next(true);
         
            
          })
          .catch(e => console.error(e));
      });


   

   
  }
 
  getDatabaseState() {
    return this.dbReady.asObservable();
  }
 
  getDevs(): Observable<Dev[]> {
    return this.developers.asObservable();
  }
 
  getProducts(): Observable<any[]> {
    return this.products.asObservable();
  }

  getStations(): Observable<any[]>
  {
    return this.estaciones.asObservable();
  }
  getParameters(): Observable<any[]> {
    return this.parametros.asObservable();
  }
  getProgramas(): Observable<any[]> {
    return this.programas.asObservable();
  }

  getEquipoCaudal(): Observable<any[]> {
    return this.equipos_caudal.asObservable();
  }
  getEquipoNivel(): Observable<any[]> {
    return this.equipos_nivel.asObservable();
  }
  getEquipoMultiparametro(): Observable<any[]> {
    return this.equipos_multiparametro.asObservable();
  }
  getMonitoreos(): Observable<any[]> {
    return this.monitoreos.asObservable();
  }

  getPending(): Observable<any[]> {
    return this.monitoreos_pendientes.asObservable();
  }
  getSending(): Observable<any[]> {
    return this.monitoreos_enviados.asObservable();
  }
  getHistoricop(): Observable<any[]> {
    return this.historicosp.asObservable();
  }
  getHistoricoQAQC(): Observable<any[]> {
    return this.historicosQAQC.asObservable();
  }
  getUltima(): Observable<any[]> {
    return this.ultimas.asObservable();
  }
  getActulizaciones(): Observable<any[]> {
    return this.actualizaciones.asObservable();
  }
  getUsuarios(): Observable<any[]> {
    return this.usuarios.asObservable();
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
 

  loadUsuarios()
  {

    let query = 'SELECT * FROM usuarios';
    return this.database.executeSql(query, []).then(data => {
      let usuarios = []; 
      if (data.rows.length > 0){
      

        for (var i = 0; i < data.rows.length; i++) {   
        

          usuarios.push({ 
            id: data.rows.item(i).id,           
            nombre :data.rows.item(i).nombre,            
            apellido :data.rows.item(i).apellido,
            rut :data.rows.item(i).rut,   
                      
           });
        }
        console.log(usuarios);
      }
      this.usuarios.next(usuarios);
    });

  }

  addUser(nombre, apellido, user,estado)
  {
     let data = [nombre,apellido,user,estado];
     return this.database.executeSql('INSERT INTO usuarios (nombre,apellido,rut,estado) VALUES (?,?,?,?)', data).then(data => {
      
         this.loadUsuarios();
         console.log(data);
     
     });

  } 
  borrarUsuario(id)
  {
    return this.database.executeSql('DELETE FROM usuarios WHERE id = ?', [id]).then(_ => {
     
      this.loadUsuarios();

    });
    
  }
  
  habilitarUsuario(id)
  {
    return this.database.executeSql('update usuarios set estatus=1 WHERE id = ?', [id]).then(_ => {
     
      this.loadUsuarios();

    });
  }
  deshabilitarUsuario(id)
  {
    return this.database.executeSql('update usuarios set estatus=0 WHERE id = ?', [id]).then(_ => {
     
      this.loadUsuarios();

    });
  }
 

  loadDevelopers() {
    
    return this.database.executeSql('SELECT * FROM developer', []).then(data => {
      let developers: Dev[] = [];
 
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          let skills = [];
          if (data.rows.item(i).skills != '') {
            skills = JSON.parse(data.rows.item(i).skills);
          }
 
          developers.push({ 
            id: data.rows.item(i).id,
            name: data.rows.item(i).name, 
            skills: skills, 
            img: data.rows.item(i).img
           });
        }
      }
      this.developers.next(developers);
    });
  }


  loadUpdates()
  {

    let query = 'SELECT COUNT(estacion) as cantidad, estacion,MAX(fecha) as fecha FROM historicos GROUP BY estacion ';
    return this.database.executeSql(query, []).then(data => {
      let act = [], color, icon;
      if (data.rows.length > 0) {      

        for (var i = 0; i < data.rows.length; i++) {       

          act.push({ 
           estacion: data.rows.item(i).estacion,           
           fecha :data.rows.item(i).fecha,
           cantidad :data.rows.item(i).cantidad,          
                               
           });
        }
        console.log(act);
      }
      this.actualizaciones.next(act);
    });

  }
  
  loadMonitoreos() {
    let query = 'SELECT * FROM  monitoreos order by fecha_medicion ASC';
    return this.database.executeSql(query, []).then(data => {
      let monitoreos = [], color, icon;
      if (data.rows.length > 0) {
      

        for (var i = 0; i < data.rows.length; i++) {

   
          if (data.rows.item(i).ischecked=='false')
          {
            color = 'warning';
            icon  = 'time-sharp';
          }
          if (data.rows.item(i).ischecked=='true') {
            color = 'success';
            icon  = 'checkmark-done-circle-sharp';
  
          }

          monitoreos.push({ 

            id: data.rows.item(i).id,           
            estacion :data.rows.item(i).estacion,            
            fecha_medicion :data.rows.item(i).fecha_medicion,
            hora_medicion :data.rows.item(i).hora_medicion,
            ischecked: data.rows.item(i).ischecked,
            color: color,
            icon : icon
                      
           });
        }
        console.log(monitoreos);
      }
      this.monitoreos.next(monitoreos);
    });
    }

    convertIntoMili(data)
    {   

      let miliseconds = new Date(data).getTime(); 
      return(miliseconds)
    }

    loadHistorico() {
      let query = 'SELECT fecha,conductividad FROM  historicos  order by fecha ASC';
      return this.database.executeSql(query, []).then(data => {
        let historicos  = [], color, icon ,muestra;
        let aux =[];
        if (data.rows.length > 0) {
        
  
          for (var i = 0; i < data.rows.length; i++) { 

            aux.push(this.convertIntoMili(data.rows.item(i).fecha),(data.rows.item(i).conductividad)*1);
            historicos.push(aux);
            aux =[];           
          }
          
   
        }
        this.historicosp.next(historicos);
      });
      }

      clearhistoric()
      {
        this.historicosp = new BehaviorSubject([]);     
    
      }
      
      loadHistoricoP(parametro, estacion) {

         this.clearhistoric();


         let templateQty = 
         {'ph':{'icon':'caret-forward-outline','color':'medium','value':'','factor':'','unidad': ' u.ph'},
         'conductividad':{'icon':'caret-forward-outline','color':'medium','value':'','factor':'','unidad':' us/cm'},
         'nivel':{'icon':'caret-forward-outline','color':'medium','value':'','factor':'','unidad':' mbnb'},
         'caudal':{'icon':'caret-forward-outline','color':'medium','value':'','factor':'','unidad':' l/s'},
         'temperatura':{'icon':'caret-forward-outline','color':'medium','value':'','factor':'','unidad':' °C'},
         'oxigeno':{'icon':'caret-forward-outline','color':'medium','value':'','factor':'','unidad':' mg/l',},
         'turbiedad':{'icon':'caret-forward-outline','color':'medium','value':'','factor':'', 'unidad':' NTU'},
         'sdt':{'icon':'caret-forward-outline','color':'medium','value':'','factor':'','unidad':' mg/l'}};


       
        let p='conductividad';
        let e='Drop Box 0';
        let valor;
        let query = "SELECT fecha,"+parametro+" as parametro FROM  historicos WHERE estacion  like '"+estacion+"' order by fecha ASC";  

        console.log(query);    

         
        return this.database.executeSql(query, []).then(data => {
          let historicosp  = [], color, icon ,muestra;
          let aux =[];
          let serie;
          if (data.rows.length > 0) {
          
    
            for (var i = 0; i < data.rows.length; i++) { 

              valor = data.rows.item(i).parametro;
            if(valor!='')
              {
                aux.push(this.convertIntoMili(data.rows.item(i).fecha),(data.rows.item(i).parametro)*1);
                historicosp.push(aux);
                aux =[]; 

              }
                       
            }           
       
          }
          serie={'name': this.capitalizar(parametro)+' ['+estacion+']','data':historicosp,tooltip: {valueDecimals: 2, valueSuffix: templateQty[parametro]['unidad'] }};          
          this.historicosp.next(serie);
        });

        }
        
        loadHistoricoQAQC(parametro, estacion) {

          this.clearhistoric();
 
 
          let templateQty = {'ph':{'icon':'caret-forward-outline','color':'medium','value':'','factor':'','unidad': ' u.ph'},
          'conductividad':{'icon':'caret-forward-outline','color':'medium','value':'','factor':'','unidad':' us/cm'},
          'nivel':{'icon':'caret-forward-outline','color':'medium','value':'','factor':'','unidad':' l/s'},
          'caudal':{'icon':'caret-forward-outline','color':'medium','value':'','factor':'','unidad':'mbnb'},
          'temperatura':{'icon':'caret-forward-outline','color':'medium','value':'','factor':'','unidad':' °C'},
          'oxigeno':{'icon':'caret-forward-outline','color':'medium','value':'','factor':'','unidad':' mg/l',},
          'turbiedad':{'icon':'caret-forward-outline','color':'medium','value':'','factor':'', 'unidad':' NTU'},
          'sdt':{'icon':'caret-forward-outline','color':'medium','value':'','factor':'','unidad':' mg/l'}};
 
 
        
         let p='conductividad';
         let e='Drop Box 0';
         let valor;
     

         let query = `SELECT fecha, ${parametro} as parametro FROM historicos WHERE estacion LIKE '${estacion}' ORDER BY fecha ASC`;
          console.log(query);

          return this.database.executeSql(query, []).then(data => {
            let historicosp = [];

            for (let i = 0; i < data.rows.length; i++) {
              const valor = parseFloat(data.rows.item(i).parametro);

              if (!isNaN(valor)) {
                const fecha = this.convertIntoMili(data.rows.item(i).fecha);
                historicosp.push([fecha, valor]);
              }
            }

            this.historicosQAQC.next(historicosp);
          });
 
         }   



       
             


    addMonitoreo(programa,estacion,equipo_nivel,valor_nivel,equipo_caudal,valor_caudal,equipo_multiparametro,valor_temperatura,valor_ph,valor_conductividad,valor_oxigeno,equipo_turbiedad,valor_turbiedad,fecha_medicion,hora_medicion,ischecked,latitud,longitud,profundidad,observacion,id_laboratorio,inspector,metodo,tipo_agua,tipo_nivel,hora_nivel,hidroquimico,isotopico,fallido) {
      let data = [programa,estacion,equipo_nivel,valor_nivel,equipo_caudal,valor_caudal,equipo_multiparametro,valor_temperatura,valor_ph,valor_conductividad,valor_oxigeno,equipo_turbiedad,valor_turbiedad,fecha_medicion,hora_medicion,ischecked,latitud,longitud,profundidad,observacion,id_laboratorio,inspector,metodo,tipo_agua,tipo_nivel,hora_nivel,hidroquimico,isotopico,fallido];
       return this.database.executeSql('INSERT INTO monitoreos (programa,estacion,equipo_nivel,valor_nivel,equipo_caudal,valor_caudal,equipo_multi,valor_temperatura,valor_ph,valor_conductividad,valor_oxigeno,equipo_turbiedad,valor_turbiedad,fecha_medicion,hora_medicion,ischecked,latitud,longitud,profundidad,observacion,id_laboratorio,inspector,metodo,tipo_agua,tipo_nivel,hora_nivel,hidroquimico,isotopico,fallido) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', data).then(data => {
      this.loadMonitoreos();
      this.loadMonitoreoPending();
      this.loadMonitoreoSending();
    });
    }

    addEstaciones(name,programaId) {
      let data = [name,programaId];
       return this.database.executeSql('INSERT INTO estaciones (name,programaId) VALUES (?,?)', data).then(data => {
       
    });
    }

    WSaddEstacionesOLD(name,programaId,estacionId) {
      let data = [name,programaId,estacionId];
       return this.database.executeSql('INSERT INTO estaciones (name,programaId,estacionId) VALUES (?,?,?)', data).then(data => {
       
    });
    }

    WSaddEstaciones(name, programaId, estacionId,latitud,longitud) {
      return this.database.executeSql('SELECT * FROM estaciones WHERE name = ? AND programaId = ?', [name, programaId])
        .then(data => {
          if (data.rows.length === 0) {
            // No hay estaciones con el mismo nombre y programaId, puedes proceder con la inserción
            return this.database.executeSql('INSERT INTO estaciones (name, programaId, estacionId,latitud,longitud) VALUES (?, ?, ?, ?, ?)', [name, programaId, estacionId,latitud,longitud]);
          } else {
            // Ya existe una estación con el mismo nombre y programaId, puedes manejar esto según tus necesidades
            console.error('Ya existe una estación con el mismo nombre y programaId.');
            throw new Error('Estación duplicada');
          }
        })
        .catch(error => {
          console.error('Error al verificar o insertar estación:', error);
          throw error;
        });
    }




    addPrograma(name, estacionId) {
      let data = [name, estacionId];
      const programaId = estacionId;
    
      
      const deleteQuery = 'DELETE FROM programas WHERE programaId = ?';
      const deleteData = [programaId];
    
      return new Promise<void>((resolve, reject) => {
        this.database.transaction(transaction => {
          transaction.executeSql(deleteQuery, deleteData, (resultDelete) => {
            // Después de eliminar, procede con la inserción del nuevo programa
            const insertQuery = 'INSERT INTO programas(name, programaId) VALUES (?, ?)';
            transaction.executeSql(insertQuery, data, (resultInsert) => {
              resolve();
            }, (errorInsert) => {
              reject(errorInsert);
            });
          }, (errorDelete) => {
            reject(errorDelete);
          });
        });
      }).then(() => {
      
        this.loadProgramas();
      }).catch(error => {
        console.error('Error al agregar programa:', error);
      });
    }
    
    async addHistorico(fecha, certificado, estacion, valor_nivel, valor_caudal, valor_ph, valor_temperatura, valor_conductividad, valor_oxigeno, valor_turbiedad, valor_sdt) {
      try {
        // Verificar si ya existe un registro con el mismo certificado
        const existingRecord = await this.database.executeSql('SELECT * FROM historicos WHERE certificado = ?', [certificado]);
    
        if (existingRecord.rows.length > 0) {
          // Ya existe un registro con el mismo certificado, puedes manejar esto según tus necesidades
          console.error('Ya existe un registro con el mismo certificado.');
        } else {
          // No existe un registro con el mismo certificado, procede con la inserción
          const data = [fecha, certificado, estacion, valor_nivel, valor_caudal, valor_ph, valor_temperatura, valor_conductividad, valor_oxigeno, valor_turbiedad, valor_sdt];
          await this.database.executeSql('INSERT INTO historicos (fecha, certificado, estacion, nivel, caudal, ph, temperatura, conductividad, oxigeno, turbiedad, sdt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', data);
        }
      } catch (error) {
        console.error('Error al agregar histórico:', error);
        // Maneja el error según sea necesario
      }
    }
    


   /* addHistorico(fecha,certificado,estacion,valor_nivel,valor_caudal,valor_ph,valor_temperatura,valor_conductividad,valor_oxigeno,valor_turbiedad,valor_sdt,) {
      let data = [fecha,certificado,estacion,valor_nivel,valor_caudal,valor_ph,valor_temperatura,valor_conductividad,valor_oxigeno,valor_turbiedad,valor_sdt];
       return this.database.executeSql('INSERT INTO historicos (fecha,certificado,estacion,nivel,caudal,ph,temperatura,conductividad,oxigeno,turbiedad,sdt) VALUES (?,?,?,?,?,?,?,?,?,?,?)', data).then(data => {
        //this.loadUpdates();
    });
    }*/
   
    addProgramaMonitoreo(id_table_mysql,id_programa,id_estacion,nivel_enable,caudal_enable,ph_enable,temperatura_enable,conductividad_enable,oxigeno_enable,turbiedad_enable,sdt_enable)
    {
     
      let data = [id_table_mysql,id_programa,id_estacion,nivel_enable,caudal_enable,ph_enable,temperatura_enable,conductividad_enable,oxigeno_enable,turbiedad_enable,sdt_enable];
       return this.database.executeSql('INSERT INTO programa_estacion (id_table_mysql,id_programa,id_estacion,nivel_enable,caudal_enable,ph_enable,tempe_enable,conductividad_enable,oxigeno_enable,turbiedad_enable,sdt_enable) VALUES (?,?,?,?,?,?,?,?,?,?,?)', data).then(data => {
      
    });
    }

    

    deleteMonitoreo(id) {
      return this.database.executeSql('DELETE FROM monitoreos WHERE id = ?', [id]).then(_ => {
        this.loadMonitoreos();
        this.loadMonitoreoPending();
        this.loadMonitoreoSending();
       
      });
    }
    deleteHistorico(estacion) {
      return this.database.executeSql('DELETE FROM historicos WHERE estacion = ?', [estacion]).then(_ => {
               this.loadUpdates();       
      });
    }

    deleteallHistorico() {
      return this.database.executeSql('DELETE FROM historicos', ).then(_ => {
        this.loadUpdates();      
      });
    }

    updateMonitoreo(id){
     
      return this.database.executeSql("update monitoreos set ischecked='true' where id =?", [id]).then(_ => {
         this.loadMonitoreos();
         this.loadMonitoreoPending();
         this.loadMonitoreoSending();
        
      });
    }
    
    updateDataMonitoreo(dataMonitoreo)
    {

      console.log(dataMonitoreo);     
      console.log(dataMonitoreo.programa)
      let id = dataMonitoreo.id_monitoreo;
      console.log(id);    
      let hora = this.extraerHora(dataMonitoreo.datetime);
      let fecha = this.extraerFecha(dataMonitoreo.datetime);

     return this.database.executeSql("update monitoreos set fallido='"+dataMonitoreo.fallido+"', hidroquimico='"+dataMonitoreo.hidroquimico+"',isotopico='"+dataMonitoreo.isotopico+"',programa='"+dataMonitoreo.programa+"',fecha_medicion='"+fecha+"', hora_medicion='"+hora+"',equipo_nivel='"+dataMonitoreo.equipo_nivel+"',valor_nivel='"+dataMonitoreo.valor_nivel+"',equipo_caudal='"+dataMonitoreo.equipo_caudal+"',valor_caudal='"+dataMonitoreo.valor_caudal+"',equipo_multi='"+dataMonitoreo.equipo_multiparametro+"',valor_temperatura='"+dataMonitoreo.valor_temperatura+"',valor_ph='"+dataMonitoreo.valor_ph+"',valor_conductividad='"+dataMonitoreo.valor_conductividad+"',valor_oxigeno='"+dataMonitoreo.valor_oxigeno+"',equipo_turbiedad='"+dataMonitoreo.equipo_turbidimetro+"',valor_turbiedad='"+dataMonitoreo.valor_turbiedad+"', profundidad='"+dataMonitoreo.profundidad+"',observacion='"+dataMonitoreo.observacion+"', id_laboratorio='"+dataMonitoreo.id_laboratorio+"' , inspector='"+dataMonitoreo.inspector+"', metodo='"+dataMonitoreo.metodo+"', tipo_agua='"+dataMonitoreo.tipo_agua+"' , tipo_nivel='"+dataMonitoreo.tipo_agua+"' , hora_nivel='"+dataMonitoreo.hora_nivel+"' where id =?", [id]).then(_ => {
       
        this.loadMonitoreos();
        this.loadMonitoreoPending();
        this.loadMonitoreoSending();
       
     });     

    }
    
    
      
    deleteMonitoreos()
    {
      return this.database.executeSql('delete from monitoreos').then(_ => {
        this.loadMonitoreos();
        this.loadMonitoreoPending();
        this.loadMonitoreoSending();       
       
      });

    }  




   

    updateResponseServer(data)
    {
      let id;
      let increment = 0;       
      console.log(data);
       id = data.id;
        return this.database.executeSql("update monitoreos set ischecked='"+data.resultado+"',serverip='"+data.server+"',dateserver='"+data.datatime+"' where id = ?",[id]).then(_ => {
          this.loadMonitoreos();
          this.loadMonitoreoPending();
          this.loadMonitoreoSending();
        // increment++;
       });     
     

    }


    loadQaqc(estacion)
    {  
      let query ="SELECT m.estacion AS estacion ,m.conductividad AS conductividad,m.ph AS ph,m.temperatura AS temperatura,m.oxigeno as oxigeno,m.sdt as sdt,m.nivel as nivel,m.caudal as caudal,m.turbiedad as turbiedad, m.fecha AS fecha  FROM historicos m INNER JOIN (SELECT estacion , MAX(fecha) AS ult_fecha FROM historicos WHERE estacion='"+estacion+"' GROUP BY estacion ) t ON  m.fecha=t.ult_fecha AND m.estacion='"+estacion+"' LIMIT 1";

      return this.database.executeSql(query, []).then(data => {
        let ultima = [];
        if (data.rows.length > 0) {
          for (var i = 0; i < data.rows.length; i++) {
            ultima.push({  
                   
              estacion :data.rows.item(0).estacion,
              fecha: data.rows.item(0).fecha,     
              conductividad : data.rows.item(0).conductividad,   
              ph: data.rows.item(0).ph,
              temperatura: data.rows.item(0).temperatura,
              oxigeno: data.rows.item(0).oxigeno, 
              sdt: data.rows.item(0).sdt,
              nivel : data.rows.item(0).nivel,
              caudal: data.rows.item(0).caudal,
              turbiedad: data.rows.item(0).turbiedad
                       
             });
          }
         
        }
        this.ultimas.next(ultima);
      });
  
    }

    

   

    loadProm(estacion,parametro) : Promise<Prom>
    {

      let query = "SELECT MAX("+parametro+") as max,MIN("+parametro+") as min,AVG("+parametro+") as avg FROM historicos WHERE estacion='"+estacion+"'";
      return this.database.executeSql(query, []).then(data => {
       
        return { 

          max : data.rows.item(0).max,
          min : data.rows.item(0).min,       
          avg : data.rows.item(0).avg       

        }

       });

    }
  


 


    loadQaqck(estacion): Promise<QAQC> {


      console.log(estacion);

        
      let query ="SELECT m.estacion AS estacion ,m.conductividad AS conductividad,m.ph AS ph,m.temperatura AS temperatura,m.oxigeno as oxigeno,m.sdt as sdt,m.nivel as nivel,m.caudal as caudal,m.turbiedad as turbiedad, m.fecha AS fecha  FROM historicos m INNER JOIN (SELECT estacion , MAX(fecha) AS ult_fecha FROM historicos WHERE estacion='"+estacion+"' GROUP BY estacion ) t ON  m.fecha=t.ult_fecha AND m.estacion='"+estacion+"' LIMIT 1";
      return this.database.executeSql(query, []).then(data => {        
   
        return {
         
    
          estacion: estacion, 
          elementos: data.rows.item(0).cnt_datos,       
          valor_nivel : data.rows.item(0).media_nivel,       
          valor_caudal: data.rows.item(0).media_caudal,         
          valor_temperatura: data.rows.item(0).media_temperatura,
          valor_ph: data.rows.item(0).media_ph,
          valor_conductividad: data.rows.item(0).media_conductividad,
          valor_oxigeno: data.rows.item(0).varianza_ce,          
          valor_turbiedad: data.rows.item(0).media_turbiedad,
          valor_sdt: data.rows.item(0).media_sdt,
          varianza_ce: data.rows.item(0).varianza_ce,
          varianza_caudal: data.rows.item(0).varianza_caudal,
          varianza_nivel: data.rows.item(0).varianza_nivel,
          varianza_ox:  data.rows.item(0).varianza_oxigeno,
          varianza_temp : data.rows.item(0).varianza_temperatura,
          varianza_ph: data.rows.item(0).varianza_ph,
          varianza_sdt: data.rows.item(0).varianza_sdt,
          varianza_turbiedad:  data.rows.item(0).varianza_turbiedad,


  
        }
      });
    }  

   RaizCuadrada(numero) {
      if (numero < 0) {
        return "No se puede calcular la raíz cuadrada de un número negativo";
      } else {
        return Math.sqrt(numero);
      }
    }


    capitalizar(str) {
      if (str && typeof str === 'string') {
          // Verifica si el string es 'ph' y devuelve 'pH'
          return str.toLowerCase() === 'ph' ? 'pH' : str.charAt(0).toUpperCase() + str.slice(1);
      } else {
          return str;
      }
  }


    LoadData(estacion): Promise<QAQC> {


      console.log(estacion);        
      let query = "SELECT AVG(conductividad) AS media_conductividad, " +
      "SUM((conductividad - (SELECT AVG(conductividad) FROM historicos)) * (conductividad - (SELECT AVG(conductividad) FROM historicos))) / COUNT(conductividad) AS varianza_ce, "+
      "SUM((oxigeno - (SELECT AVG(oxigeno) FROM historicos)) * (oxigeno - (SELECT AVG(oxigeno) FROM historicos))) / COUNT(oxigeno) AS varianza_oxigeno, "+
      "SUM((ph - (SELECT AVG(ph) FROM historicos)) * (ph - (SELECT AVG(ph) FROM historicos))) / COUNT(ph) AS varianza_ph, "+
      "SUM((temperatura - (SELECT AVG(temperatura) FROM historicos)) * (temperatura - (SELECT AVG(temperatura) FROM historicos))) / COUNT(temperatura) AS varianza_temperatura, "+
      "SUM((sdt - (SELECT AVG(sdt) FROM historicos)) * (sdt - (SELECT AVG(sdt) FROM historicos))) / COUNT(sdt) AS varianza_sdt, "+
      "SUM((turbiedad - (SELECT AVG(turbiedad) FROM historicos)) * (turbiedad - (SELECT AVG(turbiedad) FROM historicos))) / COUNT(sdt) AS varianza_turbiedad, "+
      "SUM((nivel - (SELECT AVG(nivel) FROM historicos)) * (nivel - (SELECT AVG(nivel) FROM historicos))) / COUNT(nivel) AS varianza_nivel, "+
      "SUM((caudal - (SELECT AVG(caudal) FROM historicos)) * (caudal - (SELECT AVG(caudal) FROM historicos))) / COUNT(caudal) AS varianza_caudal, "+
      "AVG(temperatura) AS media_temperatura, " +
      "AVG(pH) AS media_ph, " +
      "AVG(oxigeno) AS media_oxigeno, " +
      "AVG(nivel) AS media_nivel, " +
      "AVG(caudal) AS media_caudal, " +
      "AVG(sdt) AS media_sdt, " +
      "AVG(turbiedad) AS media_turbiedad, " +
      "COUNT(*) AS cnt_datos " +
      "FROM historicos " +
      "WHERE estacion = '" + estacion + "'";

      return this.database.executeSql(query, []).then(data => {         
   
        return {
         
    
          estacion: estacion, 
          elementos: data.rows.item(0).cnt_datos,       
          valor_nivel : data.rows.item(0).media_nivel,       
          valor_caudal: data.rows.item(0).media_caudal,         
          valor_temperatura: data.rows.item(0).media_temperatura,
          valor_ph: data.rows.item(0).media_ph,
          valor_conductividad: data.rows.item(0).media_conductividad,
          valor_oxigeno: data.rows.item(0).varianza_ce,          
          valor_turbiedad: data.rows.item(0).media_turbiedad,
          valor_sdt: data.rows.item(0).media_sdt,
          varianza_ce: data.rows.item(0).varianza_ce,
          varianza_caudal: data.rows.item(0).varianza_caudal,
          varianza_nivel: data.rows.item(0).varianza_nivel,
          varianza_ox:  data.rows.item(0).varianza_oxigeno,
          varianza_temp : data.rows.item(0).varianza_temperatura,
          varianza_ph: data.rows.item(0).varianza_ph,
          varianza_sdt: data.rows.item(0).varianza_sdt,
          varianza_turbiedad:  data.rows.item(0).varianza_turbiedad,
         
  
        }
      });
    }  



    ResumData(estacion: any): Promise<Resum> {
      let nivel = [];
      let caudal = [];
      let temperatura = [];
      let ph = [];
      let conductividad = [];
      let oxigeno = [];
      let turbiedad = [];
      let sdt = [];
  
      let query = "SELECT nivel, caudal, temperatura, ph, conductividad, oxigeno, turbiedad, sdt FROM historicos WHERE estacion = ? ORDER BY fecha ASC";
      return this.database.executeSql(query, [estacion.trim()]).then(data => {
  
          const columnas = ['nivel', 'caudal', 'temperatura', 'ph', 'conductividad', 'oxigeno', 'turbiedad', 'sdt'];
          let totalElementos = 0;
  
          for (let i = 0; i < data.rows.length; i++) {
            totalElementos++;
              columnas.forEach(columna => {
                  const valor = parseFloat(data.rows.item(i)[columna]);
                  if (!isNaN(valor))
                  {
                      // Usar las variables definidas al principio de la función para almacenar los arrays dinámicamente
                     
                      switch (columna) {
                          case 'nivel':
                              nivel.push(valor);
                              break;
                          case 'caudal':
                              caudal.push(valor);
                              break;
                          case 'temperatura':
                              temperatura.push(valor);
                              break;
                          case 'ph':
                              ph.push(valor);
                              break;
                          case 'conductividad':
                              conductividad.push(valor);
                              break;
                          case 'oxigeno':
                              oxigeno.push(valor);
                              break;
                          case 'turbiedad':
                              turbiedad.push(valor);
                              break;
                          case 'sdt':
                              sdt.push(valor);
                              break;
                      }
                  }
              });
          }
  
          return {
              data_nivel: nivel,
              data_caudal: caudal,
              data_temp: temperatura,
              data_ph: ph,
              data_ce: conductividad,
              data_ox: oxigeno,
              data_turbiedad: turbiedad,
              data_sdt: sdt,
              totalElementos: totalElementos,
          };
      });
  }
  

   

    ResumDataold(estacion: any): Promise < Resum > {
      let nivel = [];
      let caudal = [];
      let temperatura = [];
      let ph = [];
      let conductividad = [];
      let oxigeno = [];
      let turbiedad = [];
      let sdt = [];
      let query = "SELECT  nivel, caudal, temperatura, ph, conductividad, oxigeno, turbiedad, sdt FROM historicos WHERE estacion ='" + estacion + "' ORDER BY fecha ASC";
      return this.database.executeSql(query, []).then(data => {
 
          const columnas = ['nivel', 'caudal', 'temperatura', 'ph', 'conductividad', 'oxigeno', 'turbiedad', 'sdt']; 
          for (let i = 0; i < data.rows.length; i++) {
              columnas.forEach(columna => {
                  const valor = parseFloat(data.rows.item(i)[columna]);
                  if (!isNaN(valor)) {
                      // Usar un objeto para almacenar los arrays dinámicamente
                      if (!resum[columna]) {
                          resum[columna] = [];
                      }
                      resum[columna].push(valor);
                  }
              });
 
          } 
          return {
              data_nivel: nivel,
              data_caudal: caudal, // Solo tomamos el primer valor, ya que es un único valor en tu código original
              data_temp: temperatura,
              data_ph: ph,
              data_ce: conductividad,
              data_ox: oxigeno,
              data_turbiedad: turbiedad,
              data_sdt: sdt,
              totalElementos:1
          };
      });
  }

  loadEstaciones1(): Promise<Control>
  {
    let estaciones =[];   
    let query = "select name, estacionId, programaId from estaciones";
    return this.database.executeSql(query, []).then(data => {

      for (var i = 0; i < data.rows.length; i++) {

      return {

        nombre: data.rows.item(i).name,
        id: data.rows.item(i).estacionId,
        programa: data.rows.item(i).programaId

      }
    }

    });      

  }

  /*loadlocations(programa):Promise<Markers[]>
  {
   

    return this.database.executeSql('SELECT * FROM estaciones WHERE programaID = ? ORDER BY name', [programa]).then(data => 
      {
        let estaciones: Markers[] = [];
  
    
        for (let i = 0; i < data.rows.length; i++) {
          estaciones.push({
            nombre: data.rows.item(i).name,
            id: data.rows.item(i).estacionId,
            latitud: data.rows.item(i).latitud,
            longitud: data.rows.item(i).longitud,
            programa: data.rows.item(i).programaId,
          });
        }  
        return estaciones;
      });
  }*/

  loadlocations(programa): Promise<Markers[]> {
    return this.database.executeSql(`
      SELECT monitoreos.ischecked as ischecked, estaciones.estacionId as estacionId, estaciones.name as estacion, estaciones.programaID AS programa, estaciones.latitud AS estacion_latitud, estaciones.longitud AS estacion_longitud
      FROM programas
      LEFT JOIN estaciones ON programas.programaId = estaciones.programaId
      LEFT JOIN monitoreos ON estaciones.name = monitoreos.estacion
      WHERE programas.programaId = ?
    `, [programa])
    .then(data => {
      let estaciones: Markers[] = [];
      for (let i = 0; i < data.rows.length; i++) {
        estaciones.push({
          nombre: data.rows.item(i).estacion,
          id: data.rows.item(i).estacionId,
          latitud: data.rows.item(i).estacion_latitud,
          longitud: data.rows.item(i).estacion_longitud,
          programa: data.rows.item(i).programa,
          checked :  data.rows.item(i).ischecked,
        });
      }
      return estaciones;
    })
    .catch(error => {
      console.error('Error al cargar ubicaciones desde la base de datos: ', error);
      return []; // O maneja el error según tu lógica de la aplicación
    });
  }

  loadEstaciones(): Promise<Control[]>
  {
    let query = "SELECT name, estacionId, programaId FROM estaciones";
    return this.database.executeSql(query, []).then(data => 
    {
      let estaciones: Control[] = [];
  
      for (let i = 0; i < data.rows.length; i++) {
        estaciones.push({
          nombre: data.rows.item(i).name,
          id: data.rows.item(i).estacionId,
          programa: data.rows.item(i).programaId
        });
      }  
      return estaciones;
    });

    
  }

ComboEstaciones(id): Promise<Combo[]> {
  return this.database.executeSql('SELECT * FROM estaciones WHERE programaId = ? ORDER BY name', [id])
    .then(data => {
      let estaciones: Combo[] = [];

      for(let i = 0; i < data.rows.length; i++) 
      {
        estaciones.push({
          id: data.rows.item(i).estacionId,
          name: data.rows.item(i).name,         
          programa: data.rows.item(i).programaId
        });
      }
      return estaciones;
    }).catch(error => {
      console.error('Error al cargar estaciones desde la base de datos: ', error);
      return []; // O maneja el error según tu lógica de la aplicación
    });
}


  
 

    ReloadHistoricoP(parametro: any, estacion: any): Promise<Chart> 
    {

    
      let query = "SELECT fecha," + parametro + " as parametro FROM  historicos WHERE estacion ='" + estacion + "' order by fecha ASC";
      return this.database.executeSql(query, []).then(data => {
 
          for (var i = 0; i < data.rows.length; i++) {
 
              return {
 
                  value: data.rows.item(i).parametro,
                  date: data.rows.item(i).fecha,
              }
          } 
 
      });
  }

 

    getRespuesta(id): Promise<Serv> {
      return this.database.executeSql('SELECT id,serverip,dateserver FROM monitoreos WHERE id = ?', [id]).then(data => {
        
   
        return {
          id: data.rows.item(0).id,
          serverip: data.rows.item(0).serverip,
          dateserver: data.rows.item(0).dateserver,
         
        }
      });
    }  

   


 
 
  addDeveloper(name, skills, img) {
    let data = [name, JSON.stringify(skills), img];
    return this.database.executeSql('INSERT INTO developer (name, skills, img) VALUES (?, ?, ?)', data).then(data => {
      this.loadDevelopers();
      console.log(data);
    });
  }

  getMonitoreo(id): Promise<Mnt> {
    return this.database.executeSql('SELECT * FROM monitoreos WHERE id = ?', [id]).then(data => {

  
 
      return {
        id: data.rows.item(0).id,
        ischecked: data.rows.item(0).ischecked,
        programa: data.rows.item(0).programa,
        estacion: data.rows.item(0).estacion,
        equipo_nivel : data.rows.item(0).equipo_nivel,
        valor_nivel : data.rows.item(0).valor_nivel,
        equipo_caudal: data.rows.item(0).equipo_caudal,
        valor_caudal: data.rows.item(0).valor_caudal,
        equipo_multiparametro: data.rows.item(0).equipo_multi,
        valor_temperatura: data.rows.item(0).valor_temperatura,
        valor_ph: data.rows.item(0).valor_ph,
        valor_conductividad: data.rows.item(0).valor_conductividad,
        valor_oxigeno: data.rows.item(0).valor_oxigeno,
        equipo_turbiedad: data.rows.item(0).equipo_turbiedad,
        valor_turbiedad: data.rows.item(0).valor_turbiedad,
        hora: data.rows.item(0).hora_medicion,
        fecha:data.rows.item(0).fecha_medicion,
        latitud: data.rows.item(0).latitud,
        longitud:data.rows.item(0).longitud,
        profundidad: data.rows.item(0).profundidad,
        observacion: data.rows.item(0).observacion,
        id_laboratorio:data.rows.item(0).id_laboratorio,
        inspector: data.rows.item(0).inspector,
        metodo: data.rows.item(0).metodo,
        tipo_agua: data.rows.item(0).tipo_agua,
        tipo_nivel:data.rows.item(0).tipo_nivel,
        hora_nivel: data.rows.item(0).hora_nivel,
        hidroquimico:  data.rows.item(0).hidroquimico,
        isotopico:  data.rows.item(0).isotopico,
        fallido :  data.rows.item(0).fallido,



      }
    });
  }  





 
 
  getDeveloper(id): Promise<Dev> {
    return this.database.executeSql('SELECT * FROM developer WHERE id = ?', [id]).then(data => {
      let skills = [];
      if (data.rows.item(0).skills != '') {
        skills = JSON.parse(data.rows.item(0).skills);
      }
 
      return {
        id: data.rows.item(0).id,
        name: data.rows.item(0).name, 
        skills: skills, 
        img: data.rows.item(0).img
      }
    });
  }
 
  deleteDeveloper(id) {
    return this.database.executeSql('DELETE FROM developer WHERE id = ?', [id]).then(_ => {
      this.loadDevelopers();
      this.loadProducts();
    });
  }

  loadMonitoreoPending()
  {

    let query = "SELECT * FROM  monitoreos where ischecked='false' order by fecha_medicion DESC";
    return this.database.executeSql(query, []).then(data => {
      let monitoreos = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          monitoreos.push({ 

            id: data.rows.item(i).id,           
            estacion :data.rows.item(i).estacion,            
            fecha_medicion :data.rows.item(i).fecha_medicion,
            hora_medicion :data.rows.item(i).hora_medicion,
            ischecked: data.rows.item(i).ischecked,
            equipo_nivel: data.rows.item(i).equipo_nivel,
            valor_nivel: data.rows.item(i).valor_nivel,
            equipo_caudal: data.rows.item(i).equipo_caudal,
            valor_caudal: data.rows.item(i).valor_caudal,
            equipo_multi: data.rows.item(i).equipo_multi,
            valor_tempt : data.rows.item(i).valor_temperatura,
            valor_ph: data.rows.item(i).valor_ph,
            valor_conductividad: data.rows.item(i).valor_conductividad,
            valor_oxigeno: data.rows.item(i).valor_oxigeno,
            equipo_turb: data.rows.item(i).equipo_turbiedad,
            valor_turb: data.rows.item(i).valor_turbiedad,
            latitud: data.rows.item(i).latitud,
            longitud: data.rows.item(i).longitud,
            profundidad: data.rows.item(i).profundidad,
            observacion: data.rows.item(i).observacion,
            id_laboratorio:data.rows.item(i).id_laboratorio,
            inspector: data.rows.item(i).inspector,
            metodo: data.rows.item(i).metodo,
            tipo_agua: data.rows.item(i).tipo_agua,
            tipo_nivel:data.rows.item(i).tipo_nivel,
            hora_nivel: data.rows.item(i).hora_nivel,
            programa : data.rows.item(i).programa,
            hidroquimico : data.rows.item(i).hidroquimico,
            isotopico : data.rows.item(i).isotopico,
            fallido : data.rows.item(i).fallido

           });
        }
        console.log(monitoreos);
      }
      this.monitoreos_pendientes.next(monitoreos);
    });

  }

  loadMonitoreoSending()
  {

    let query = "SELECT * FROM  monitoreos where ischecked='true' order by fecha_medicion DESC";
    return this.database.executeSql(query, []).then(data => {
      let monitoreos = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          monitoreos.push({ 
            id: data.rows.item(i).id,           
            estacion :data.rows.item(i).estacion,            
            fecha_medicion :data.rows.item(i).fecha_medicion,
            hora_medicion :data.rows.item(i).hora_medicion,
            ischecked: data.rows.item(i).ischecked,
                      
           });
        }
        console.log(monitoreos);
      }
      this.monitoreos_enviados.next(monitoreos);
    });

  }
 
  updateDeveloper(dev: Dev) {
    let data = [dev.name, JSON.stringify(dev.skills), dev.img];
    return this.database.executeSql(`UPDATE developer SET name = ?, skills = ?, img = ? WHERE id = ${dev.id}`, data).then(data => {
      this.loadDevelopers();
    })
  }

  loadStations()
  {

    let query = 'SELECT * FROM estaciones order by name';
    return this.database.executeSql(query, []).then(data => {
      let estaciones = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          estaciones.push({ 
            id: data.rows.item(i).id,
            name: data.rows.item(i).name,
           
           });
        }
      }
      this.estaciones.next(estaciones);
    });

  }

updtStations(programa){

 
    return this.database.executeSql('SELECT * FROM estaciones WHERE programaID = ? ORDER BY name', [programa]).then(data => {
      let estaciones = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          estaciones.push({ 
            id: data.rows.item(i).id,
            name: data.rows.item(i).name,
           
           });
        }
      }
      this.estaciones.next(estaciones);
    });


  }

  loadParameters(){

    let query = 'SELECT * FROM parametros';
    return this.database.executeSql(query, []).then(data => {
      let parametros = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          parametros.push({ 
            value: data.rows.item(i).value,
            name: data.rows.item(i).name,
           
           });
        }
      }
      this.parametros.next(parametros);
    });


  }
  loadProgramastoarr()
  {

    let query = 'SELECT * FROM programas';
    this.database.executeSql(query, []).then(data => { 

      let programas = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          programas.push({ 
            id: data.rows.item(i).id,
            name: data.rows.item(i).name,
           
           });
        }
      }
      this.progrmas_array = programas;
      console.log(programas);
      return(programas);

    });


  }

  loadProgramas(){

    let query = 'SELECT * FROM programas';
    return this.database.executeSql(query, []).then(data => {
      let programas = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          programas.push({ 

            id: data.rows.item(i).programaId,
            name: data.rows.item(i).name,
           
           });
        }
      }
      this.programas.next(programas);
    });

  }

  loadEquipoCaudal(){

    let query = "SELECT * FROM equipos where tipo='1'";
    return this.database.executeSql(query, []).then(data => {
      let equipos_caudal = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          equipos_caudal.push({ 
            id: data.rows.item(i).id,
            name: data.rows.item(i).codigo,
            tipo: data.rows.item(i).tipo_equipo,
           
           });
        }
      }
      this.equipos_caudal.next(equipos_caudal);
    });

  }
 

  loadEquipoNivel(){

    let query = "SELECT * FROM equipos where tipo='2'";
    return this.database.executeSql(query, []).then(data => {
      let equipos_nivel = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          equipos_nivel.push({ 
            id: data.rows.item(i).id,
            name: data.rows.item(i).codigo,
            tipo: data.rows.item(i).tipo_equipo,
           
           });
        }
      }
      this.equipos_nivel.next(equipos_nivel);
    });

  }

  loadEquipoMultiparametro(){

    let query = "SELECT * FROM equipos where tipo='3'";
    return this.database.executeSql(query, []).then(data => {
      let equipos_multiparametro = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          equipos_multiparametro.push({ 
            id: data.rows.item(i).id,
            name: data.rows.item(i).codigo,
            tipo: data.rows.item(i).tipo_equipo,
           
           });
        }
      }
      this.equipos_multiparametro.next(equipos_multiparametro);
    });

  }

  



 
  loadProducts() {
    let query = 'SELECT product.name, product.id, developer.name AS creator FROM product JOIN developer ON developer.id = product.creatorId';
    return this.database.executeSql(query, []).then(data => {
      let products = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          products.push({ 
            name: data.rows.item(i).name,
            id: data.rows.item(i).id,
            creator: data.rows.item(i).creator,
           });
        }
      }
      this.products.next(products);
    });
  }
 
  addProduct(name, creator) {
    let data = [name, creator];
    return this.database.executeSql('INSERT INTO product (name, creatorId) VALUES (?, ?)', data).then(data => {
      this.loadProducts();
    });
  }
}

