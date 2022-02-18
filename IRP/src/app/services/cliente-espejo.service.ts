import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ClienteEspejo } from '../models/clienteEspejo';
import { Clientes } from '../models/clientes';
import { ClientesService } from './clientes.service';
import { MapboxGLService } from './mapbox-gl.service';
import { AlertasService } from './alertas.service';


@Injectable({
  providedIn: 'root'
})
export class ClienteEspejoService {

  clienteEspejo: ClienteEspejo;
  ClienteEspejoArray: ClienteEspejo[]=[];
  rutas: Clientes[]=[];

  constructor(
    
     private http: HttpClient,
     private clientes: ClientesService, 
     private mapboxLgService: MapboxGLService, 
     private alertasService: AlertasService) { }

  






  getIRPURL( api: string, id: string ){
    let test = '';

    if(!environment.prdMode){

      test = environment.TestURL;

    }
    const URL = environment.preURL+ test  + environment.postURL + api +id;



    return URL;

  }



  
  private getRutas(ruta){

    const URL = this.getIRPURL( environment.clientesURL , ruta);
    console.log('URL',URL)
    return this.http.get<Clientes[]>( URL );

  }

  

  syncRutas(ruta){

    this.clientes.rutasClientes = [];
    this.clientes.nuevosClientes = [];
    this.mapboxLgService.marcadores = [];



   this.alertasService.presentaLoading('Cargando Clientes ')


    this.getRutas(ruta).subscribe(
      resp =>{

        this.clientes.rutasClientes = resp.slice(0);

        this.mapboxLgService.createmapa(this.mapboxLgService.divMapa,false,false);


        this.mapboxLgService.agregarMarcadores(this.clientes.rutasClientes,'NOMBRE','IdCliente',false)


         this.alertasService.loadingDissmiss();

        this.alertasService.message('Planificación De Rutas', 'Un total de : '+ resp.slice(0).length+' clientes se agregaron al mapa');
   
  
      }, error => {

        if(error){

          this.alertasService.message('Planificación De Rutas','Error cargando clientes');

        }


      }
      
     


    );
  }
  

  private postClienteEspejo (ruta){

    const URL = this.getIRPURL( environment.postCLienteEspejoURL,'' );

    const options = {

      headers: {

          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Origin': '*'
      }

      
    };




    return this.http.post( URL, JSON.stringify(ruta), options );
 
  }

  insertarClienteEspejo(ruta){

    console.log(ruta, 'rutaaaaaa insertada')

     this.alertasService.presentaLoading('Guardando cambios')
;
       this.postClienteEspejo(ruta).subscribe(
      

      resp => {
        
       this.mapboxLgService.marcadores = [];

        this.mapboxLgService.createmapa(this.mapboxLgService.divMapa,false,false);

           this.alertasService.loadingDissmiss()


            this.alertasService.message('IRP','Los cambios se efectuaron con exito');

      }, error => {

        console.log('Rerror', error);


        this.alertasService.message('IRP','Error guardados las rutas');


      }
    )

  }




}
