import { Injectable } from '@angular/core';
import { GuiaEntrega } from '../models/guiaEntrega';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AlertasService } from './alertas.service';
import { ServicioClienteService } from './servicio-cliente.service';
import { PlanificacionEntregasService } from './planificacion-entregas.service';

@Injectable({
  providedIn: 'root'
})
export class GuiasService {

  guiasArray: GuiaEntrega[]=[];
  guiasArrayExistentes: GuiaEntrega[]=[];
  guiasArrayRuta: GuiaEntrega[]=[];
  url = null;


  constructor(
    
    private http: HttpClient,
    public alertasService: AlertasService,
    public servicioClienteService: ServicioClienteService,
    public planificacionEntregasService: PlanificacionEntregasService
    
    
    ) { }

  getIRPURL( api: string ){
    let test: string = ''
    if ( !environment.prdMode ) {
      test = environment.TestURL;
    }

    const URL = environment.preURL  + test +environment.postURL + api ;
    console.log(URL, 'POST GUIAS URL')
    this.url = URL;
    return URL;


  }
  getIRPURLEstado( api: string,estado ){
    let test: string = ''
    if ( !environment.prdMode ) {
      test = environment.TestURL;
    }

    const URL = environment.preURL  + test +environment.postURL + api + environment.guiasURLEstadoParam +estado;

    return URL;


  }

  private getEstado(estado ){
    const URL = this.getIRPURLEstado( environment.guiasURL, estado);

    console.log(URL,'URL guias')
    return this.http.get<GuiaEntrega[]>( URL );
  }

  syncGuiasRuta(estado){
   this.alertasService.presentaLoading('Cargando lista de Guias')
    this.getEstado(estado).subscribe(
      resp =>{
     this.alertasService.loadingDissmiss();
        this.guiasArrayRuta = resp.slice(0);
        console.log('rutasEstado',this.guiasArrayRuta)
      }, error =>{
        this.alertasService.loadingDissmiss();
        let errorObject = {
          titulo: 'Lista de guias',
          fecha: new Date(),
          metodo:'GET',
          url:error.url,
          message:error.message,
          rutaError:'app/services/guias-service.ts',
          json:JSON.stringify(this.guiasArrayRuta)
        }
        this.servicioClienteService.errorArray.push(errorObject)
        console.log(error)
       
      }

    );
  }


  syncGuiasEnRutaPromise(estado){

    return  this.getEstado(estado).toPromise();
   }
 
 



  private postActualizarGuias (guia){
    const URL = this.getIRPURL( environment.guiasURL );
    const options = {
      headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Origin': '*'
      }
    };

    return this.http.post( URL, JSON.stringify(guia), options );
 
  }

  private putActualizarGuias (guia,ID){
    let URL = this.getIRPURL( environment.guiasURL );
    const options = {
      headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Origin': '*'
      }
    };
URL = URL + environment.idParam + ID
    console.log(URL, 'URL PUT GUIA')
    return this.http.put( URL, JSON.stringify(guia), options );
 
  }

putGuias(){

this.guiasArrayExistentes.forEach(guia =>{
  this.putActualizarGuias(guia, guia.idGuia).subscribe(

    resp =>{
  console.log('guia actualizada', guia)

    }, error =>{
      let errorObject = {
        titulo: 'actualizar guias',
        metodo:'PUT',
        url:error.url,
        message:error.message,
        rutaError:'app/services/guias-service.ts',
        json:JSON.stringify(this.guiasArray)
      }
      this.planificacionEntregasService.errorArray.push(errorObject)
      console.log('error actualizando guia', guia, error)

    }
  )
})

this.guiasArrayExistentes = [];
}



  cargarArraygoFacturas(guias){
    this.guiasArray = [];
    this.guiasArray = guias;
  
    console.log(guias, 'facturas array load')
  
    }

  insertarGuias(guia){

    console.log(  guia, 'insertar guia')

   return  this.postActualizarGuias( guia).toPromise();


  }


  insertarGuias2(){

    console.log(   this.guiasArray, '  this.guiasArray insertar')
 this.guiasArray.forEach( guia =>{


  this.postActualizarGuias( guia).subscribe(
    
    resp => {

     console.log('completed')


 

    }, error => {
 
      let errorObject = {
        titulo: 'Insertar guias',
        metodo:'POST',
        url:error.url,
        message:error.message,
        rutaError:'app/services/guias-service.ts',
        json:JSON.stringify(this.guiasArray)
      }
      this.planificacionEntregasService.errorArray.push(errorObject)
      console.log('error')
    
    }
  )
})
this.guiasArray = [];

  }


  

}
