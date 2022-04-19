import { Injectable } from '@angular/core';
import { ActualizaFacturaGuia } from '../models/actualizaFacturaGuia';
import { DataTableService } from './data-table.service';
import { PlanificacionEntregas } from '../models/planificacionEntregas';
import { ListaClientesGuiasPage } from '../pages/lista-clientes-guias/lista-clientes-guias.page';
import { ModalController } from '@ionic/angular';
import { ListaGuiasPageModule } from '../pages/lista-guias/lista-guias.module';
import { ListaGuiasPage } from '../pages/lista-guias/lista-guias.page';
import * as  mapboxgl from 'mapbox-gl';
import { AlertasService } from './alertas.service';
import { PlanificacionEntregasService } from './planificacion-entregas.service';
import { Rutero, RuteroMH } from '../models/Rutero';


//=============================================================================
// INTERFACE DE ORDEN ENTREGA CLIENTES
//=============================================================================

interface ordenEntregaCliente {
  id: string,
  cliente: string,
  latitud: number,
  longitud:number,
  distancia: number,
  duracion:number,
  direccion:string,
  bultosTotales:number,
  order_visita: number
}

interface factura {
idGuia:string,
factura:PlanificacionEntregas
  
}

//=============================================================================
// INTERFACE DE  MODELO GUIA DE ENTREGA
//=============================================================================

interface  GuiaEntregaArray{

      idGuia: string,
      guiaExistente:boolean,
      zona: string,
      ruta: string,
      fecha: string,
      numClientes: number,
      totalFacturas:number

      camion:{

        chofer:string,  
        idCamion: string,
        capacidad: number,
        pesoRestante: number,
        peso: number,
        estado: string,
        HH: string,
        volumen: number,
      }

      facturas: PlanificacionEntregas[],
      ordenEntregaCliente:ordenEntregaCliente[]
}

@Injectable({

  providedIn: 'root'

})

export class ControlCamionesGuiasService {

//=============================================================================
// VARIABLES GLOBALES
//=============================================================================

    rutaZona = null;
    fecha:string;
    lngLat: [number, number] = [ -84.14123589305028, 9.982628288210657 ];
    listaGuias : GuiaEntregaArray[] = [];
    orderArray = [];
    compareArray  : ordenEntregaCliente[] = [];
    complete = 0;

    // Variables proceso de ordenamiento MAURICIO HERRA

    listos: number = 1;
    total: number = 1;
    actual: number = 0;
    menor:  number = 0;
    i:      number = 0;
    p:      number = 0;
    rutero: RuteroMH[] = [];


 constructor( 
    public modalCtrl: ModalController,
    public datableService:DataTableService, 
    public alertasService: AlertasService,
    public planificacionEntregasService: PlanificacionEntregasService

  ) {
  

 }


//=============================================================================
// LIMPIA LOS DATOS DEL SERVICIO
//=============================================================================

 limpiarDatosCamionesGuiasService(){



 }


//=============================================================================
// GENERA EL ID DE LA GUIA
//=============================================================================

generarIDGuia(){

  console.log(this.rutaZona.Ruta, 'ruu')
let    consecutivo  = null,
       date               = new Date(this.fecha),  // FECHA HOY
       year               = date.getFullYear(),  // AÑO
       month              = (date.getMonth() + 1).toString().padStart(2, "0"), // MES ACTUAL FORMATO 2 DIGITOS EJEMPLO 01
       day                = date.getDate().toString().padStart(2, "0"), // DIA ACTUAL FORMATO FECHA
       ramdomNumber = Math.floor(1000 + Math.random() * 9000);  // DEVUELVE NUMERO ALEATORIO DE 4 DIGITOS
       consecutivo   = year+''+month+''+day+this.rutaZona.Ruta+'V'+ramdomNumber; // CONCATENAMOS LOS VALORES Y GENERAMOS CONSECUTIVO

       return consecutivo; // DEVUELVE CONSECUTIVO

}





//=============================================================================
// OPCIONES DE  GUIAS
//=============================================================================


generarGuia(factura,camion) {

  let capacidad = camion.capacidadPeso;
  let peso = factura.factura.TOTAL_PESO_NETO;
  let pesoRestante = camion.capacidadPeso - factura.factura.TOTAL_PESO_NETO; 
  let volumen = factura.factura.TOTAL_VOLUMEN;
  let guia = {

    idGuia: this.generarIDGuia(),
    guiaExistente:false,
    totalFacturas:1,
    zona: this.rutaZona.Ruta,
    ruta: this.rutaZona.Zona,
    fecha: this.fecha,
    numClientes: 1,
    
   
  camion:{

   chofer:camion.chofer,  
   idCamion: camion.idCamion,
   capacidad: capacidad,
   pesoRestante: pesoRestante,
   peso: peso,
   estado : 'INI',
   HH : 'nd',
   volumen: volumen,

  },
    facturas: [],
    ordenEntregaCliente:[]
 
}



let orderPush = {

  id: factura.factura.CLIENTE_ORIGEN,
  cliente: factura.factura.NOMBRE_CLIENTE,
  latitud: factura.factura.LATITUD,
  longitud:factura.factura.LONGITUD,
  distancia: 0,
  duracion:0,
  direccion:factura.factura.CLIENTE_DIRECCION,
  bultosTotales:0,
  order_visita: 0

}
factura.idGuia = guia.idGuia;

guia.facturas.push(factura.factura)
guia.ordenEntregaCliente.push(orderPush)
this.listaGuias.push(guia)
console.log('Guia generada ', guia)

  



}




async agregarFacturaGuia(factura:factura){

  const modal = await this.modalCtrl.create({
    component: ListaGuiasPage,
    cssClass: 'large-modal',
    componentProps:{
      camiones: this.listaGuias
    }
  });
  modal.present();
      
        
      
  const { data } = await modal.onDidDismiss();
  let camion : GuiaEntregaArray;

  if(data !== undefined){






    this.borrarFacturaExistente(factura, factura.idGuia, data.camion.idGuia);

    let i = this.listaGuias.findIndex(guia => guia.idGuia === data.camion.idGuia );


    
    if(i >=0){




     this.listaGuias[i].camion.peso  += factura.factura.TOTAL_PESO_NETO
     this.listaGuias[i].camion.volumen  += factura.factura.TOTAL_VOLUMEN
     this.listaGuias[i].camion.pesoRestante  = this.listaGuias[i].camion.capacidad - this.listaGuias[i].camion.peso
     this.listaGuias[i].numClientes += 1;
     factura.idGuia =  this.listaGuias[i].idGuia


     let orderPush = {

      id: factura.factura.CLIENTE_ORIGEN,
      cliente: factura.factura.NOMBRE_CLIENTE,
      latitud: factura.factura.LATITUD,
      longitud:factura.factura.LONGITUD,
      direccion:factura.factura.CLIENTE_DIRECCION,
      bultosTotales:0,
      distancia: 0,
      duracion:0,
      order_visita: 0
    
    }

     const f =  this.listaGuias[i].ordenEntregaCliente.findIndex(facturas => facturas.id == factura.factura.CLIENTE_ORIGEN );

     if(f < 0){
      this.listaGuias[i].ordenEntregaCliente.push(orderPush)

     } 



   
  
     this.listaGuias[i].facturas.push(factura.factura)

     console.log(this.listaGuias)
    }
  return camion = data.camion ;

      
  }





}



async detalleGuia(idGuia){

let i  = this.listaGuias.findIndex(guia =>  guia.idGuia == idGuia);

if(i >=0){

  console.log(this.listaGuias[i]);

  const modal = await this.modalCtrl.create({
    component: ListaClientesGuiasPage,
    cssClass: 'large-modal',
    componentProps:{
      facturas:this.listaGuias[i].facturas,
      rutaZona:this.rutaZona,
      fecha:this.fecha,
      idGuia:idGuia
    }
  });
  modal.present();


}
}

borrarGuia(idGuia){

  let i  = this.listaGuias.findIndex(guia =>  guia.idGuia == idGuia);

  if(i >=0){
    let facturas = this.listaGuias[i].facturas;

    for(let f =0; f < facturas.length; f++){
      let cliente = facturas[f]
      this.planificacionEntregasService.borrarIdGuiaFactura(idGuia);
      if(f === this.listaGuias[i].facturas.length -1){
        this.listaGuias.splice(i,1);
      }
    }
  }

};


borrarTodasLasGuias(){

  this.listaGuias = [];
  this.planificacionEntregasService.borrarIdGuiaFacturas();

};





//=============================================================================
// POST GUIAS
//=============================================================================


generarPost(){
  console.log(' inicio For loop de cada una de las guias' )

  for(let i = 0; i  < this.listaGuias.length; i++){
    console.log('Evaluando Guia',this.listaGuias[i].idGuia  )
    this.llenarRutero( this.listaGuias[i] );
    this.ordenaMH(0);
    //this.devolverRutero(i);
    console.log(this.listaGuias[i]);
    //this.asignarDistanciaDuracion(this.listaGuias[i]);
  }
}

/////////////////////////////////////////////////////////////////////////////////////////
//   PROCESO DE ORDENAMIENTO NUEVO MH
////////////////////////////////////////////////////////////////////////////////////////


llenarRutero( guia: GuiaEntregaArray ){
  this.rutero = [];
  let item = new RuteroMH( '0', 'ISLEÑA', 9.982628288210657, -84.14123589305028, 0, 0, '', 0, 0, true );
  this.rutero.push(item);

  guia.ordenEntregaCliente.forEach( x => {
    item = new RuteroMH( x.id, x.cliente, x.latitud, x.longitud, x.distancia, x.duracion, x.direccion, x.bultosTotales, x.order_visita, false);
    this.rutero.push( item );
  });

  console.log('Rutero: ', this.rutero);
}

ordenaMH(a: number){
  let m: number;
  let o: number;

  this.getDistancia(a)
    .then( x => console.log(x))
    .then( x => {
      m = this.calcularMenor();
      console.log(m);
      this.rutero[m].asignado = true;
      o = this.sumarOrdenados();
      this.rutero[m].order_visita = o
      if ( o < this.rutero.length - 1 ){
        this.ordenaMH(m);
      }
    });
}

sumarOrdenados(){
  let c: number = 0;

  this.rutero.forEach( x => {
    if (x.asignado){
      c += 1;
    }
  });
  return c - 1;
}

async getDistancia( a: number ) {

  // NOS AYUDA ENCONTRAR LA DISTANCIA Y DURACION

  let start: string;
  let end:   string;
  let URL:   string;
  console.log(URL);

  for (let i = 1; i < this.rutero.length; i++) {
    if ( !this.rutero[i].asignado ){
      start = this.rutero[a].longitud +','+  this.rutero[a].latitud;
      end = this.rutero[i].longitud +','+  this.rutero[i].latitud;
      URL =  `https://api.mapbox.com/directions/v5/mapbox/driving/${start};${end}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`;

      const query = await fetch(
        URL,
        { method: 'GET' }
      );
      const json = await query.json();

      if(json.routes){
        this.rutero[i].distancia = Number((json.routes[0].distance / 1000).toFixed(2));
    
        this.rutero[i].duracion = Number((json.routes[0].duration / 60).toFixed(2) );
      }
    }
    
  }
  
  return this.rutero;
}

calcularMenor(){
  let menor:  number = 100000;
  let indice: number = 0;

  for (let i = 0; i < this.rutero.length; i++) {
    if ( !this.rutero[i].asignado ){
      if ( this.rutero[i].distancia < menor ){
        menor = this.rutero[i].distancia;
        indice = i;
      }
    }
  }
  return indice;
}

devolverRutero(i: number){
  let j: number;

  this.rutero.forEach( x => {
    j = this.listaGuias[i].ordenEntregaCliente.findIndex( y => y.id === x.id );
    if ( j >= 0 ){
      this.listaGuias[i].ordenEntregaCliente[j].duracion = x.duracion;
      this.listaGuias[i].ordenEntregaCliente[j].distancia = x.distancia;
      this.listaGuias[i].ordenEntregaCliente[j].order_visita = x.order_visita;
    }
  });
}

//////////////////////////////////////////////////////////////////////
//
//    FIN DEL PROCESO DE ORDENAMIENTO
//
/////////////////////////////////////////////////////////////////////



 
exportarGuias(){

  for(let i = 0; i < this.listaGuias.length; i++){

    let guia = this.listaGuias[i];
    let facturas = this.listaGuias[i].facturas;

    let rutero = this.listaGuias[i].ordenEntregaCliente;

    console.log(guia)
    console.log(facturas)
    console.log(rutero)

    this.completePost(guia,facturas,rutero)

  }
}   


completePost(guia: GuiaEntregaArray, facturas:PlanificacionEntregas[], ruteros:ordenEntregaCliente[]){

  console.log(ruteros, 'ruteros')

let jj = ruteros;
for(let r = 0; r < jj.length; r++){

  console.log(jj[r])
}
  let postFacturas = [];

  let postRutero = [];



 const guiaCamion = { 
    idGuia: guia.idGuia,
    fecha: guia.fecha,
    zona: guia.zona,
    ruta: guia.ruta,
    idCamion: guia.camion.idCamion,
    numClientes: guia.numClientes,
    peso: guia.camion.peso,
    estado:  guia.camion.estado,
    HH: guia.camion.HH,
    volumen: guia.camion.volumen
   }


    for(let i =0; i <  facturas.length; i++){

      const actualizarFactura = {
        numFactura: facturas[i].FACTURA,
        tipoDocumento:facturas[i].TIPO_DOCUMENTO,
        despachado: 'S',
        rubro3:  guia.idGuia,
        U_LATITUD: facturas[i].LATITUD,
        U_LONGITUD: facturas[i].LONGITUD

   }

postFacturas.push(actualizarFactura)

if(i === facturas.length -1){

  console.log('facturas completed')



}
        
    }

    for (let j = 0; j< ruteros.length; j++){

  
      console.log(ruteros[j].distancia)
        
        const rut = {
          idGuia:guia.idGuia,
          idCliente:ruteros[j].id,
          nombre: ruteros[j].cliente,
          direccion:ruteros[j].direccion,
          latitud:ruteros[j].latitud,
          longitud:ruteros[j].latitud,
          checkin: null,
          latitud_check: null,
          longitud_check: null,
          observaciones:null,
          estado: 'P',
          bultos:ruteros[j].id,
          checkout:null,
          distancia: ruteros[j].distancia,
          Duracion: ruteros[j].duracion,
          orden_Visita:ruteros[j].order_visita
       }
      
       postRutero.push(rut)
      
      
      
        if(j === ruteros.length -1){
      
          console.log('guiaCamion', guiaCamion)
            console.log('postFacturas', postFacturas)
            console.log('postRutero',  postRutero)
            postFacturas = []
            postRutero = [];
      
      
      
         
        }
      }
  
 }
 

//=============================================================================
// OPCIONES DE  DIRECCIONAMIENTO
//=============================================================================


async  consultarDistanciaDuracion( start, end) {

  // NOS AYUDA ENCONTRAR LA DISTANCIA Y DURACION

  let startPoint  =  start;
  let endPoint  =  end;
  let URL =  `https://api.mapbox.com/directions/v5/mapbox/driving/${startPoint};${endPoint}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`
  console.log(URL)
  const query = await fetch(
    URL,
    { method: 'GET' }
  );
  const json = await query.json();

  let distance  = null ;
  let duration  = null;
  if(json.routes){
    distance = Number((json.routes[0].distance / 1000).toFixed(2));

    duration = Number((json.routes[0].duration / 60).toFixed(2) );
  }
  console.log('Distancia: ', distance);
  console.log('Duración: ', duration);
  return {distance , duration}
}

//=======================================================================
// ASIGNAR DISTANCIA  DURACION A LOS CLIENTES EN REFERENCIA A ISLEÑA
//========================================================================

asignarDistanciaDuracion( guia:GuiaEntregaArray) {

  console.log('Asignar Distancia Duracion en referencia a ISLEÑA ',guia.idGuia  )
  this.complete = 0;
  this.orderArray = [];
  this.compareArray = [];
  
  for (let i = 0; i <  guia.ordenEntregaCliente.length ; i++){
  
    let lngLat =  guia.ordenEntregaCliente[i].longitud +','+  guia.ordenEntregaCliente[i].latitud;

    this.consultarDistanciaDuracion(this.lngLat, lngLat ).then(resp =>{
      const { distance, duration } = resp;
      guia.ordenEntregaCliente[i].distancia = distance;
      guia.ordenEntregaCliente[i].duracion = duration;
  
      if(i === guia.ordenEntregaCliente.length -1){
        console.log('Asignacion de distancia y duracion finalizada',guia )
        this.ordernarDistancia(guia.ordenEntregaCliente)
      }
    });
  }
}


//=======================================================================
// ORDENAR DISTANCIA: ORDENA EL ARREGLO DE ORDENENTREGA POR DISTANCIA
//========================================================================


ordernarDistancia(clientes:ordenEntregaCliente[]){
  
  clientes.sort( ( a, b ) => a.distancia - b.distancia )

  let startValue : ordenEntregaCliente  = null

  for(let i = 0; i < clientes.length ; i++ ){

    if(i === 0){

      startValue =   clientes[0];
      startValue.order_visita =  this.orderArray.length +1;

      this.orderArray.push(startValue);
      this.compareArray = clientes.slice(1);

      if(clientes.length == 1){

        this.complete += 1;
        this.orderArray = [];
        this.compareArray = [];
        if(this.complete == this.listaGuias.length){
          console.log('Orden evaluado procedemos a exportar ',clientes )
          this.exportarGuias();
        }
      }

      for(let j =0; j< this.compareArray.length; j++){

        let cliente = this.compareArray[j];
        console.log('Ordenamiento Distancia ',cliente.id )
        this.consultarDistanciaDuracion(this.orderArray[this.orderArray.length-1].longitud+','+this.orderArray[this.orderArray.length-1].latitud , this.compareArray[j].longitud +','+this.compareArray[j].latitud ).then( 
          resp =>{

            if(resp){
              console.log('Distancia Asignada ',cliente.id )

              const { distance, duration } = resp;
              cliente.distancia = distance;
              cliente.duracion = duration;
            }
          });

        if(j === this.compareArray.length -1){

          this.ordernarDistancia(this.compareArray)
          this.orderArray = []
          this.compareArray = []

          this.complete += 1;

          if(this.complete == this.listaGuias.length){
            console.log('Orden evaluado procedemos a exportar ',clientes )
            this.exportarGuias();
          } 
        }
      }

    }
  }
}



//=============================================================================
// OPCIONES DE FACTURAS
//=============================================================================


borrarFactura(factura, idGuia){

  let i  = this.listaGuias.findIndex(guia =>  guia.idGuia == idGuia);
  console.log(factura, idGuia, factura.factura.FACTURA);
  console.log(i)
if(i >=0){
let facturas = this.listaGuias[i].facturas;

console.log(facturas)
  let f = this.listaGuias[i].facturas.findIndex(guia =>  guia.FACTURA == factura.factura.FACTURA);
  console.log(f)
if(f>=0){

  this.listaGuias[i].facturas.splice(f,1);
  factura.idGuia = '';
  this.listaGuias[i].numClientes -= 1
  if(this.listaGuias[i].facturas.length == 0){
    this.listaGuias.splice(i,1)
   
  }
}

}

}

borrarFacturaExistente(factura, idGuia,nuevaGuia){

  let i  = this.listaGuias.findIndex(guia =>  guia.idGuia == idGuia);
  console.log(factura, idGuia, factura.factura.FACTURA);
  console.log(i)
if(i >=0){
let facturas = this.listaGuias[i].facturas;
this.listaGuias[i].numClientes -= 1
console.log(facturas)
  let f = this.listaGuias[i].facturas.findIndex(guia =>  guia.FACTURA == factura.factura.FACTURA);
  console.log(f)
if(f>=0){

  this.listaGuias[i].facturas.splice(f,1);

  if(idGuia!= nuevaGuia && this.listaGuias[i].facturas.length === 0){
    this.listaGuias.splice(i,1)


  }



  factura.idGuia = '';



}

}

}











}

