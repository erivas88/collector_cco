import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-serveresponse',
  templateUrl: './serveresponse.page.html',
  styleUrls: ['./serveresponse.page.scss'],
})
export class ServeresponsePage implements OnInit {

  id_monitoreo : any;
  ServerResponse :{};
  registrosDB: any ;
  ip: any;
  date : any;

  constructor(private route: ActivatedRoute, 
    private db: DatabaseService,
    private router: Router,) { }

  ngOnInit() {
  }

  ionViewDidEnter(){  
    this.id_monitoreo = this.route.snapshot.queryParamMap.get('id');   

    this.db.getRespuesta(this.id_monitoreo).then(data => { 
      this.registrosDB= data;

      console.log(data);

      this.ip =this.registrosDB.serverip
      this.date =this.registrosDB.dateserver;


    })
    console.log(this.ip);
  }  

  seeMore(){
  
  }
  

}
