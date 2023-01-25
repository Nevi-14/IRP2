import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { PlanificacionEntregas } from '../models/planificacionEntregas';
import { AlertasService } from './alertas.service';
import { ConfiguracionesService } from './configuraciones.service';

interface facturaGuia{
  idGuia: string,
  factura: PlanificacionEntregas
}
interface factura{

  id: number,
  cliente:string,
  direccion:string,
  volumenTotal: number,
  pesoTotal:number,
  bultosTotales:number,
  camion:string,
  facturas: facturaGuia[]

}



@Injectable({
  providedIn: 'root'
})
export class RutaFacturasService {

  loading: HTMLIonLoadingElement;

  // control perso facturas
  totalBultosFactura: number = 0;
  pesoTotalBultosFactura: number = 0;

  //

  rutaFacturasArray: PlanificacionEntregas[]=[];

  paginationArray:PlanificacionEntregas[]=[];
  facturas :  factura[]=[];

  constructor(
    
    private http: HttpClient, 
    public alertasService: AlertasService,
    public configuracionesService: ConfiguracionesService
    
    
    
    ) { }





 



    getURL(api: string, id: string, fecha: string){


    let test = '';
    if(!environment.prdMode){

      test = environment.TestURL;
      
    }

    let  URL = this.configuracionesService.company.preURL  + test +   this.configuracionesService.company.postURL + api+ environment.rutaParam + id + environment.entregaParam + fecha;
    this.configuracionesService.api = URL;
    //alert(URL)

    return URL;

  }



 
  getRutaFacturas(ruta: string, fecha:string){

    const URL = this.getURL(environment.rutaFacturasURL,ruta, fecha);

console.log(URL)
    return this.http.get<PlanificacionEntregas[]>(URL);

  }



  

syncRutaFacturas(ruta:string, fecha:string){

  this.rutaFacturasArray = [];
  
  this.alertasService.presentaLoading('Cargando facturas');

  this.getRutaFacturas(ruta, fecha).subscribe(
    resp =>{
      this.rutaFacturasArray = resp;
      this.totalBultosFactura = 0;
      this.pesoTotalBultosFactura = 0;

      this.facturas = [];


     
   



      for( let i = 0 ;  i < this.rutaFacturasArray.length; i++){

        const  facturaCliente = {

          id: this.rutaFacturasArray[i].CLIENTE_ORIGEN,
          cliente:this.rutaFacturasArray[i].NOMBRE_CLIENTE,
          direccion:this.rutaFacturasArray[i].DIRECCION_FACTURA,
          volumenTotal: this.rutaFacturasArray[i].TOTAL_VOLUMEN,
          pesoTotal:this.rutaFacturasArray[i].TOTAL_PESO_NETO,
          bultosTotales: Number(this.rutaFacturasArray[i].RUBRO1),
          camion:'',
          facturas: [
            
          ]
      
        }
     
       facturaCliente.facturas.push({idGuia:null, factura:this.rutaFacturasArray[i]});

        this.agrupar(this.rutaFacturasArray[i].CLIENTE_ORIGEN,facturaCliente);


      }

      console.log(this.rutaFacturasArray,'array new')

      this.rutaFacturasArray.forEach(factura =>{


      

        console.log(typeof( Number(factura.RUBRO1)), Number(factura.RUBRO1)  + factura.TOTAL_PESO_NETO , 'rubri1',typeof( factura.TOTAL_PESO_NETO),'pepso t')

        this.pesoTotalBultosFactura +=factura.TOTAL_PESO_NETO;
        this.totalBultosFactura += Number(factura.RUBRO1);

        
      })

      this.alertasService.loadingDissmiss();

      this.alertasService.message('PLANIFICACIONDE ENTREGAS', 'Un total de ' + resp.length +' facturas se agregaron al sistema')
       
      console.log(this.pesoTotalBultosFactura, 'peso bultos')
      console.log(this.totalBultosFactura, 'total bultos')
   
    }
  )


 
}




agrupar(identificador, factura){
const i = this.facturas.findIndex(factura => factura.id === identificador);

if(i >=0){

  this.facturas[i].facturas.push(factura.facturas[0])

  return 

}

 this.facturas.push(factura);

}






}
