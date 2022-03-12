import { Injectable } from '@angular/core';
import { Clientes } from '../models/clientes';
import { HttpClient } from '@angular/common/http';
import { AlertasService } from './alertas.service';
import { ServiciosCompartidosService } from './servicios-compartidos.service';
import { ModalController } from '@ionic/angular';
import { environment } from '../../environments/environment';
interface Marcadores {
  select:boolean,
  id: string,
  excluir:boolean,
  cliente: any,
  modificado: boolean,
  nuevoCliente: boolean,
  color: string,
  nombre: string,
  latitud:number,
  longitud:number,
  marker?: mapboxgl.Marker,
  centro?: [number, number]
}
@Injectable({
  providedIn: 'root'
})
export class PlanificacionRutasService {
  errorArray = [];
  marcadores : Marcadores[]=[]
  marcadoresExcluidos : Marcadores[]=[]
  rutaZona = null;
  constructor(
public http: HttpClient,
public alertasService: AlertasService,
public serviciosCompartidosService: ServiciosCompartidosService,
public modalCtrl: ModalController

  ) { }


  excluirClienteRuta(id){

    const i = this.marcadores.findIndex (marcador => marcador.id == id);

    if(i >=0 ){
      this.marcadores[i].modificado = true;
      this.marcadores[i].excluir = true;


    }


  }

  incluirClienteRuta(id){

    const i = this.marcadores.findIndex (marcador => marcador.id == id);

    if(i >=0 ){
      this.marcadores[i].modificado = false;
      this.marcadores[i].excluir = false


    }


  }
  

  
  moverRuta(id){

    const i = this.marcadores.findIndex (marcador => marcador.id == id);

    if(i >=0 ){



      const rutaZona =  this.serviciosCompartidosService.listaRutasModal();
      
      rutaZona.then(valor =>{
    
            if(valor !== undefined){
            
              const rutasClientes = {
                IdCliente:this.marcadores[i].id,
                Fecha: new Date().toISOString(),
                Usuario: 'IRP',
                Zona: valor.Zona ,
                Ruta:valor.Ruta   ,
                Latitud: this.marcadores[i].cliente.LATITUD,
                Longitud: this.marcadores[i].cliente.LONGITUD
                        }
           this.insertarClienteEspejo([rutasClientes]);
console.log([rutasClientes])
this.marcadores.splice(i,1)

                      
             }
        
           
          })



      


    }


  }


  getIRPURL( api: string, provincia: string , canton:string , distrito: string ,id: string ){

    let test: string = ''

    if ( !environment.prdMode ) {

      test = environment.TestURL;
    }

    const URL = environment.preURL  + test + environment.postURL + api + environment.provinciaID+provincia+ environment.cantonID+canton+ environment.distritoID+distrito+ id;

console.log(URL)

    return URL;

  }
  getIRPURLNormal( api: string, id: string ){
    let test = '';

    if(!environment.prdMode){

      test = environment.TestURL;

    }
    const URL = environment.preURL+ test  + environment.postURL + api +id;

console.log(URL,'post cliente espejo')

    return URL;

  }

  private getClientes(provincia, canton, distrito  ){

    const URL = this.getIRPURL( environment.clientesURL, provincia,canton,distrito,'');
    return this.http.get<Clientes[]>( URL );
  }

  syncClientes(provincia, canton, distrito ){
  return   this.getClientes(provincia, canton, distrito).toPromise();
  }

  exportarMarcadores(){

    const marcadoresExportar = [];
    
        for(let i = 0; i < this.marcadores.length; i ++){     
    
          if(this.marcadores[i].modificado  || this.marcadores[i].nuevoCliente || this.marcadores[i].excluir){
    
           marcadoresExportar.push(this.marcadores[i])

          }
    
        }
    
        this.marcadores = [];

      return marcadoresExportar;
      }

      private postClienteEspejo (ruta){

        const URL = this.getIRPURLNormal( environment.postCLienteEspejoURL,'' );
    
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

       
    
         this.alertasService.presentaLoading('Guardando cambios')
    ;
           this.postClienteEspejo(ruta).subscribe(
          
    
          resp => {
            console.log(resp, 'rutaaaaaa resp')
            this.modalCtrl.dismiss();
         
               this.alertasService.loadingDissmiss()
    
    
                this.alertasService.message('IRP','Los cambios se efectuaron con exito');
    
          },  error =>{
            this.alertasService.loadingDissmiss();
            let errorObject = {
              titulo: 'Insertar rutero',
              fecha: new Date(),
              metodo:'POST',
              url:error.url,
              message:error.message,
              rutaError:'app/services/cliente-espejo-service.ts',
              json:JSON.stringify(ruta)
            }
            this.errorArray.push(errorObject)
            console.log(error)
           
          }
        )
    
      }

}
