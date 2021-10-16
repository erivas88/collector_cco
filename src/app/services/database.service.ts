import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { HttpClient } from '@angular/common/http';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { BehaviorSubject, Observable } from 'rxjs';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';

 
export interface Serv {
  id: number,
  serverip: string,
  dateserver:string,
 
}

export interface Prom {
  max: string,
  min: string,
  avg: string,
 
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
}

export interface Chart {
  value: number,
  date: string
 
}


export interface QAQC { 

 
 
  estacion: string, 
  fecha: string,
  valor_nivel : string, 
  valor_caudal: string, 
  valor_temperatura: string,
  valor_ph: string,
  valor_conductividad: string,
  valor_oxigeno: string,
  valor_turbiedad: string,
  valor_sdt: string,
  

  

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
 

  equipos_caudal = new BehaviorSubject([]);
  equipos_nivel = new BehaviorSubject([]);
  equipos_multiparametro = new BehaviorSubject([]);
  equipo_turbidiometro = new BehaviorSubject([]);
  historicosp = new BehaviorSubject([]);
  historicosQAQC = new BehaviorSubject([]);
  actualizaciones = new BehaviorSubject([]);
  progrmas_array : any;
  configSend='false';


 
  constructor(
    private backgroundMode: BackgroundMode,private plt: Platform,private sqlitePorter: SQLitePorter, private sqlite: SQLite, private http: HttpClient) {
    this.plt.ready().then(() => {
      this.sqlite.create({
        name: 'monitoreo_rev1.23.db',
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
           // this.loadQaqc();
           // this.loadHistorico();
  
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

  getStations(): Observable<any[]> {
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

   
          if (data.rows.item(i).ischecked=='false') {
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
            icon : icon,


                      
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
          
         // console.log(historicos);
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


         let templateQty = {'ph':{'icon':'caret-forward-outline','color':'medium','value':'','factor':'','unidad': ' u.ph'},
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
          serie={'name':parametro+' ['+estacion+']','data':historicosp,tooltip: {valueDecimals: 2, valueSuffix: templateQty[parametro]['unidad'] }};          
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
           //serie={'name':parametro+' ['+estacion+']','data':historicosp,tooltip: {valueDecimals: 2, valueSuffix: templateQty[parametro]['unidad'] }};          
           this.historicosQAQC.next(historicosp);
         });
 
         }   
        
             


    addMonitoreo(programa,estacion,equipo_nivel,valor_nivel,equipo_caudal,valor_caudal,equipo_multiparametro,valor_temperatura,valor_ph,valor_conductividad,valor_oxigeno,equipo_turbiedad,valor_turbiedad,fecha_medicion,hora_medicion,ischecked,latitud,longitud) {
      let data = [programa,estacion,equipo_nivel,valor_nivel,equipo_caudal,valor_caudal,equipo_multiparametro,valor_temperatura,valor_ph,valor_conductividad,valor_oxigeno,equipo_turbiedad,valor_turbiedad,fecha_medicion,hora_medicion,ischecked,latitud,longitud];
       return this.database.executeSql('INSERT INTO monitoreos (programa,estacion,equipo_nivel,valor_nivel,equipo_caudal,valor_caudal,equipo_multi,valor_temperatura,valor_ph,valor_conductividad,valor_oxigeno,equipo_turbiedad,valor_turbiedad,fecha_medicion,hora_medicion,ischecked,latitud,longitud) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', data).then(data => {
      this.loadMonitoreos();
      this.loadMonitoreoPending();
      this.loadMonitoreoSending();
    });
    }

    addEstaciones(name,estacionId) {
      let data = [name,estacionId];
       return this.database.executeSql('INSERT INTO estaciones (name,estacionId) VALUES (?,?)', data).then(data => {
        //this.loadUpdates();
       // this.loadProgramas();
    });
    }

    addPrograma(name,estacionId)
    {
      let data = [name,estacionId];
      return this.database.executeSql('INSERT INTO programas(name,codedatabase) VALUES (?,?)', data).then(data => {
       //this.loadUpdates();
       this.loadProgramas();
   });

    }


    addHistorico(fecha,certificado,estacion,valor_nivel,valor_caudal,valor_ph,valor_temperatura,valor_conductividad,valor_oxigeno,valor_turbiedad,valor_sdt,) {
      let data = [fecha,certificado,estacion,valor_nivel,valor_caudal,valor_ph,valor_temperatura,valor_conductividad,valor_oxigeno,valor_turbiedad,valor_sdt];
       return this.database.executeSql('INSERT INTO historicos (fecha,certificado,estacion,nivel,caudal,ph,temperatura,conductividad,oxigeno,turbiedad,sdt) VALUES (?,?,?,?,?,?,?,?,?,?,?)', data).then(data => {
        //this.loadUpdates();
    });
    }
   
    addProgramaMonitoreo(id_table_mysql,id_programa,id_estacion,nivel_enable,caudal_enable,ph_enable,temperatura_enable,conductividad_enable,oxigeno_enable,turbiedad_enable,sdt_enable) {
      let data = [id_table_mysql,id_programa,id_estacion,nivel_enable,caudal_enable,ph_enable,temperatura_enable,conductividad_enable,oxigeno_enable,turbiedad_enable,sdt_enable];
       return this.database.executeSql('INSERT INTO programa_estacion (id_table_mysql,id_programa,id_estacion,nivel_enable,caudal_enable,ph_enable,tempe_enable,conductividad_enable,oxigeno_enable,turbiedad_enable,sdt_enable) VALUES (?,?,?,?,?,?,?,?,?,?,?)', data).then(data => {
      
    });
    }

    selectProgramaMonitoreo()
    {

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

     return this.database.executeSql("update monitoreos set programa='"+dataMonitoreo.programa+"',equipo_nivel='"+dataMonitoreo.equipo_nivel+"',valor_nivel='"+dataMonitoreo.valor_nivel+"',equipo_caudal='"+dataMonitoreo.equipo_caudal+"',valor_caudal='"+dataMonitoreo.valor_caudal+"',equipo_multi='"+dataMonitoreo.equipo_multiparametro+"',valor_temperatura='"+dataMonitoreo.valor_temperatura+"',valor_ph='"+dataMonitoreo.valor_ph+"',valor_conductividad='"+dataMonitoreo.valor_conductividad+"',valor_oxigeno='"+dataMonitoreo.valor_oxigeno+"',equipo_turbiedad='"+dataMonitoreo.equipo_turbidimetro+"',valor_turbiedad='"+dataMonitoreo.valor_turbiedad+"' where id =?", [id]).then(_ => {
       
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
         //console.log(ultima);
        }
        this.ultimas.next(ultima);
      });
  
    }

   

    loadProm(estacion,parametro) : Promise<Prom>{

      let query = "SELECT MAX("+parametro+") as max,MIN("+parametro+") as min,AVG("+parametro+") as avg FROM historicos WHERE estacion='"+estacion+"'";
      return this.database.executeSql(query, []).then(data => {

        return { 

          max: data.rows.item(0).max,
          min: data.rows.item(0).min,       
          avg : data.rows.item(0).avg,       

        }

       });

    }



    loadQaqck(estacion): Promise<QAQC> {


      console.log(estacion);

        
      let query ="SELECT m.estacion AS estacion ,m.conductividad AS conductividad,m.ph AS ph,m.temperatura AS temperatura,m.oxigeno as oxigeno,m.sdt as sdt,m.nivel as nivel,m.caudal as caudal,m.turbiedad as turbiedad, m.fecha AS fecha  FROM historicos m INNER JOIN (SELECT estacion , MAX(fecha) AS ult_fecha FROM historicos WHERE estacion='"+estacion+"' GROUP BY estacion ) t ON  m.fecha=t.ult_fecha AND m.estacion='"+estacion+"' LIMIT 1";

      //console.log(query);
      return this.database.executeSql(query, []).then(data => {
        
   
        return {
         
    
          estacion: data.rows.item(0).estacion, 
          fecha: data.rows.item(0).fecha,       
          valor_nivel : data.rows.item(0).nivel,       
          valor_caudal: data.rows.item(0).caudal,         
          valor_temperatura: data.rows.item(0).temperatura,
          valor_ph: data.rows.item(0).ph,
          valor_conductividad: data.rows.item(0).conductividad,
          valor_oxigeno: data.rows.item(0).oxigeno,          
          valor_turbiedad: data.rows.item(0).turbiedad,
          valor_sdt: data.rows.item(0).sdt,
         
  
        }
      });
    }  

  

    ReloadHistoricoP(parametro, estacion):  Promise<Chart> {
       
      let p='conductividad';
      let e='Drop Box 0';
      let valor;
      let query = "SELECT fecha,"+parametro+" as parametro FROM  historicos WHERE estacion ='"+estacion+"' order by fecha ASC";  

      console.log(query);          
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
            longitud: data.rows.item(i).longitud                      
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

  loadStations(){

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
            id: data.rows.item(i).codedatabase,
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