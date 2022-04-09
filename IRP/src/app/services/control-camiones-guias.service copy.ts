import { Injectable } from '@angular/core';
import { ActualizaFacturaGuia } from '../models/actualizaFacturaGuia';
import { DataTableService } from './data-table.service';
import { GestionCamionesService } from './gestion-camiones.service';
import { AlertController, ModalController } from '@ionic/angular';
import { ActualizarFacturasService } from './actualizar-facturas.service';
import { GuiasService } from './guias.service';
import { JavascriptDatesService } from './javascript-dates.service';
import { RuteroService } from './rutero.service';
import { PlanificacionEntregas } from '../models/planificacionEntregas';
import { ListaCamionesModalPage } from '../pages/lista-camiones-modal/lista-camiones-modal.page';
import { Camiones } from '../models/camiones';
import { ListaGuiasPage } from '../pages/lista-guias/lista-guias.page';
import { ListaClientesGuiasPage } from '../pages/lista-clientes-guias/lista-clientes-guias.page';
import { PlanificacionEntregasService } from './planificacion-entregas.service';
import * as  mapboxgl from 'mapbox-gl';
import { ListaGuiasPostPage } from '../pages/lista-guias-post/lista-guias-post.page';
import { AlertasService } from './alertas.service';

//=============================================================================
// INTERFACE DE ESTRUCTURA DE CADA FACTURA DENTRO DE LA GUIA
//=============================================================================

interface facturaGuia{

  cliente:string,
  idGuia: string,
  factura: PlanificacionEntregas,
  distancia: number,
  duracion:number,
  order_visita: number

}

//=============================================================================
// MODELO GUIA ENTREGA
//=============================================================================

interface  GuiaEntregaArray{

      idGuia: string,
       guiaExistente:boolean,
       chofer:string,
       fecha: Date,
       zona: string,
       ruta: string,
       consecutivo: string,
       idCamion: string,
       numClientes: number,
       capacidad: number,
       pesoRestante: number,
       peso: number,
       estado: string,
       HH: string,
       volumen: number,
       facturas: facturaGuia[]

}


@Injectable({

  providedIn: 'root'

})


export class ControlCamionesGuiasService {
  lngLat: [number, number] = [ -84.14123589305028, 9.982628288210657 ];
   guiaFacturasaActual = []
   Fecha : null;
  actualizaGuiaFacturaArray : ActualizaFacturaGuia[]=[];
  listaCamionesGuia: GuiaEntregaArray[] = [];
  guia:GuiaEntregaArray;
  rutaZona = null;
  idGuiaPostArray = [];


   startValue:facturaGuia = null;
   orderArray :facturaGuia[] = [];
   facturaGuia:facturaGuia[] = [];
   compareArray :facturaGuia[] = [];
   nullElements  :facturaGuia[] = [];




 constructor( 
   
  public datableService:DataTableService, 
  public camionesService:GestionCamionesService, 
  public alertCtrl: AlertController, public modalCtrl: ModalController,
  public actualizarFacturasService: ActualizarFacturasService,
  public guiasService: GuiasService,
  public javascriptDateService: JavascriptDatesService,
  public ruteroService:RuteroService,
  public planificacionEntregasService: PlanificacionEntregasService,
  public actualizaFacturaGuiasService:ActualizarFacturasService,
  public alertasService: AlertasService
  ) {
  

 }


//=============================================================================
// LIMPIA LOS DATOS DEL SERVICIO
//=============================================================================

 limpiarDatosCamionesGuiasService(){

   this.guiaFacturasaActual = [];
   this.Fecha = null;
   this.listaCamionesGuia = [];
   this.guia = null
   this.rutaZona = null;

 }


//=============================================================================
// GENERAR CONSECUTIVO
//=============================================================================

gerarConsecutivo(ruta, fecha){

let    consecutivo  = null,
       date               = new Date(fecha),  // FECHA HOY
       year               = date.getFullYear(),  // AÑO
       month              = (date.getMonth() + 1).toString().padStart(2, "0"), // MES ACTUAL FORMATO 2 DIGITOS EJEMPLO 01
       day                = date.getDate().toString().padStart(2, "0"), // DIA ACTUAL FORMATO FECHA
       ramdomNumber = Math.floor(1000 + Math.random() * 9000);  // DEVUELVE NUMERO ALEATORIO DE 4 DIGITOS
       consecutivo   = year+''+month+''+day+ruta+'V'+ramdomNumber; // CONCATENAMOS LOS VALORES Y GENERAMOS CONSECUTIVO

       return consecutivo; // DEVUELVE CONSECUTIVO

}

//=============================================================================
// GENERAR GUIA
//=============================================================================

crearModeloGuia(ruta,camion, fecha) {

  let guia = {
    consecutivo:this.gerarConsecutivo(ruta,fecha) ,
    idGuia: '',
    guiaExistente:false,
    chofer: camion.chofer,
    fecha: fecha,
    zona: '',
    ruta: '',
    idCamion: camion.idCamion,
    capacidad: camion.capacidadPeso,
    pesoRestante: 0,
    numClientes: 0,
    peso:  0,
    estado: '',
    HH:'',
    volumen:   0,
    facturas: null
 }

guia.facturas = [];

 return guia;

}


//=============================================================================
// INCREMENTA LOS VALORES DE VOLUMEN, PESO ACTUAL ,PESO RESTANTE, NUMERO CLIENTES
//=============================================================================

incrementarValoresGuia(consecutivo, factura){

 const i =  this.listaCamionesGuia.findIndex(guia => guia.consecutivo == consecutivo);

 if(i >=0){

  this.listaCamionesGuia[i].volumen += Number(factura.factura.RUBRO1);
  this.listaCamionesGuia[i].peso += factura.factura.TOTAL_PESO;
  this.listaCamionesGuia[i].pesoRestante = 0;
  this.listaCamionesGuia[i].pesoRestante = this.listaCamionesGuia[i].capacidad - this.listaCamionesGuia[i].peso;
  this.listaCamionesGuia[i].numClientes += this.listaCamionesGuia[i].facturas.length;

 }

}

//=============================================================================
// DISMINUYE LOS VALORES DE VOLUMEN, PESO ACTUAL ,PESO RESTANTE, NUMERO CLIENTES
//=============================================================================

disminuirValoresGuia(consecutivo, factura){

  const i =  this.listaCamionesGuia.findIndex(guia => guia.consecutivo == consecutivo);
 
  if(i >=0){
 
   this.listaCamionesGuia[i].volumen -= Number(factura.factura.RUBRO1);
   this.listaCamionesGuia[i].peso -= factura.factura.TOTAL_PESO;
   this.listaCamionesGuia[i].pesoRestante = 0;
   this.listaCamionesGuia[i].pesoRestante = this.listaCamionesGuia[i].capacidad - this.listaCamionesGuia[i].peso;
   this.listaCamionesGuia[i].numClientes += this.listaCamionesGuia[i].facturas.length;
   for ( let j = 0; j < this.listaCamionesGuia[i].facturas.length; j++){
     if(this.listaCamionesGuia[i].facturas[j].factura.FACTURA === factura.factura.FACTURA){
      this.listaCamionesGuia[i].facturas.splice(j, 1);
     }
   }
 }
  }

//=============================================================================
// CREAR GUIA
//=============================================================================


ordernarDistancia(facturas:facturaGuia[]){

  let order = 0;
  order = this.orderArray.length;
  facturas.sort( ( a, b ) => a.distancia - b.distancia )

  for(let i = 0; i < facturas.length ; i++ ){

    if(i === 0){

      this.startValue =   facturas[0];
      this.startValue.order_visita = order
     this.orderArray.push(this.startValue);

    }

    this.compareArray = facturas.slice(1);
      
    this.compareArray.forEach( ( _, index, arr ) => {

      this.getRoute(this.orderArray[this.orderArray.length -1].factura.LONGITUD+','+this.orderArray[this.orderArray.length -1].factura.LATITUD, arr[index].factura.LONGITUD +','+ arr[index].factura.LATITUD ).then(resp =>{

              const { distance, duration } = resp;
              arr[index].distancia = distance;
              arr[index].duracion = duration;

              console.log( distance, duration, ' distance, duration')
    

              facturas = [];
              facturas = this.orderArray;   
             


            });

            this.ordernarDistancia(this.orderArray) 
          
            if(facturas.length - 1 === i){
          
              console.log('Loop ends', this.orderArray, ' order')
            
            }
  
  })


  
    
  }
  

  
}



 agruparOrdernar( guia:GuiaEntregaArray) {
  this.orderArray = [];
  this.compareArray = [];
  let guiaReturn = guia;

  for (let i = 0; i < guia.facturas.length ; i++){

    let longitud = guia.facturas[i].factura.LONGITUD;
    let latitud = guia.facturas[i].factura.LATITUD ;

  this.getRoute(this.lngLat, longitud +','+ latitud ).then(resp =>{
  
    const { distance, duration } = resp;
  
    guia.facturas[i].distancia = distance;
    guia.facturas[i].duracion = duration;

    if(i == guia.facturas.length -1){
    console.log(this.orderArray, ' orderrr');
    
      this.ordernarDistancia(guia.facturas)
      
    //  this.completePost(guia.facturas, guia)
    }

    })

  }


    }


















crearGuia(factura){

  let camion = this.listaCamionesGuiaModal();

  camion.then(resp =>{

if(resp != undefined){
  let guia = this.crearModeloGuia(this.rutaZona.Ruta, resp, this.Fecha); // GENERAR MODELO GUIA

  // EMPEZAMOS A LLENAR LOS DATOS DE LA GUIA

  guia.zona = this.rutaZona.Ruta; // AGREGAMOS  LA ZONA
  guia.ruta = this.rutaZona.Ruta; // AGREGAMOS LA RUTA
  guia.idCamion = resp.idCamion; // AGREGADOS EL ID DEL CAMION
  guia.estado = 'INI'; // AGREGAMOS EL ESTADO
  guia.HH = 'nd';
  factura.idGuia = guia.consecutivo
  guia.facturas.push(factura)
   



  this.listaCamionesGuia.push(guia)
this.incrementarValoresGuia(guia.consecutivo, factura)
  this.actualizar(factura.factura.CLIENTE_ORIGEN, factura.factura.FACTURA, guia.consecutivo)


}

  })



}

async  getRoute( start, end) {
  // make a directions request using driving profile
  // an arbitrary start will always be the same
  // only the end or destination will change

let startPoint  =  start;
let endPoint  =  end
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
return {distance , duration}
}



//=============================================================================
// AGREGAR GUIA
//=============================================================================

 async agregarGuia(factura){



    const alert = await this.alertCtrl.create({

      cssClass: 'my-custom-class',
      header: 'ISLEÑA',
      message: '¿Defina la acción a ejecutar?',
      buttons: [
        {
          text: 'Generar nueva Guia',
          cssClass: 'secondary',
          handler: () => {         
          this.alertCtrl.dismiss();
          this.crearGuia(factura)
          this.removerFactura(factura)


          }
        },
        {
          text: 'Mover a guia existente',
          id: 'confirm-button',
          handler: () => {
         this.alertCtrl.dismiss();
           this.agregarFacturaGuia(factura);
 
          }
        },
  
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          id: 'cancel-button'
        }
      ]
    });


    return await alert.present();

     


}







async listaCamionesGuiaModal(){
 
  const modal = await this.modalCtrl.create({
    component: ListaCamionesModalPage,
    cssClass: 'large-modal'
  });
  modal.present();
      
        
      
  const { data } = await modal.onDidDismiss();
  let camion : Camiones;
  if(data !== undefined){

  camion = data.camion ;

      
  }


  return camion
}



removerFactura(factura){
  const index = this.listaCamionesGuia.findIndex( guia => guia.consecutivo == factura.idGuia);


  if(index >=0){

    this.guiaFacturasaActual = this.listaCamionesGuia[index].facturas;
for(let i = 0 ; i < this.listaCamionesGuia[index].facturas.length; i++){
if(this.listaCamionesGuia[index].facturas[i].factura.FACTURA == factura.factura.FACTURA){

  this.listaCamionesGuia[index].peso -= factura.factura.TOTAL_PESO;
  this.listaCamionesGuia[index].volumen -= Number(factura.factura.RUBRO1);;
  this.listaCamionesGuia[index].facturas[i].idGuia = null;
  this.actualizar(factura.factura.CLIENTE_ORIGEN, factura.factura.FACTURA, this.listaCamionesGuia[index].facturas[i].idGuia)
  this.listaCamionesGuia[index].facturas.splice(i, 1);
  this.listaCamionesGuia[index].numClientes = this.listaCamionesGuia[index].facturas.length;
  this.listaCamionesGuia[index].pesoRestante =  this.listaCamionesGuia[index].capacidad - this.listaCamionesGuia[index].peso


}

}
if(this.listaCamionesGuia[index].facturas.length == 0){
  this.listaCamionesGuia.splice(index, 1)

}  
  }

}


removerGuia(consecutivo){

for(let i = 0; i <   this.listaCamionesGuia.length; i++){

  if(this.listaCamionesGuia[i].consecutivo == consecutivo){
 
    for(let j = 0; j < this.listaCamionesGuia[i].facturas.length; j++){
      console.log(consecutivo,'consecutivo')
      this.listaCamionesGuia[i].facturas[j].idGuia = null;
      this.actualizar(this.listaCamionesGuia[i].facturas[j].factura.CLIENTE_ORIGEN, this.listaCamionesGuia[i].facturas[j].factura.FACTURA, this.listaCamionesGuia[i].facturas[j].idGuia)
    }
    this.listaCamionesGuia.splice(i,1);
  }

}
  
}

async listaGuias(camionesDisponibles){
 
  const modal = await this.modalCtrl.create({
    component: ListaGuiasPage,
    cssClass: 'large-modal',
    componentProps:{
      camiones: camionesDisponibles
    }
  });
  modal.present();
      
        
      
  const { data } = await modal.onDidDismiss();
  let camion : GuiaEntregaArray;
  if(data !== undefined){

  return camion = data.camion ;

      
  }


  
}
  

  



agregarFacturaGuia(factura:facturaGuia){

 if(factura.idGuia != '' || factura.idGuia != null || factura.idGuia != undefined){

  const index = this.listaCamionesGuia.findIndex( guia => guia.consecutivo == factura.idGuia);

 
  if(index >=0){


    if(this.listaCamionesGuia[index].facturas.length == 0){
      this.crearGuia(factura)
      this.removerFactura(factura)
      
      this.listaCamionesGuia.splice(index, 1)
    return
    } 
    
for(let i = 0 ; i < this.listaCamionesGuia[index].facturas.length; i++){
if(this.listaCamionesGuia[index].facturas[i].factura.FACTURA == factura.factura.FACTURA){

  

  console.log(index, 'index', factura)
  this.listaCamionesGuia[index].peso -= factura.factura.TOTAL_PESO;
  this.listaCamionesGuia[index].volumen -= Number(factura.factura.RUBRO1);;
  this.listaCamionesGuia[index].facturas[i].idGuia = null;
  this.actualizar(factura.factura.CLIENTE_ORIGEN, factura.factura.FACTURA, this.listaCamionesGuia[index].facturas[i].idGuia)
  this.listaCamionesGuia[index].facturas.splice(i, 1);
  this.listaCamionesGuia[index].numClientes = this.listaCamionesGuia[index].facturas.length;
  this.listaCamionesGuia[index].pesoRestante =  this.listaCamionesGuia[index].capacidad - this.listaCamionesGuia[index].peso


}



}



 
  }


  let guia = this.listaGuias(this.listaCamionesGuia);

 guia.then(resp =>{


if(resp != undefined ){
  const indexGuia = this.listaCamionesGuia.findIndex( guia => guia.consecutivo ==resp.consecutivo);





if(indexGuia < 0){

  this.listaCamionesGuia.push(resp)

}



  for(let i = 0; i < this.listaCamionesGuia.length; i++){

    if( this.listaCamionesGuia[i].consecutivo == resp.consecutivo){
      this.listaCamionesGuia[i].peso += factura.factura.TOTAL_PESO;
      this.listaCamionesGuia[i].volumen += Number(factura.factura.RUBRO1);;
 
      this.listaCamionesGuia[i].facturas.push(factura)

      if(index < 0 ){
        this.listaCamionesGuia[i].numClientes += 1;

      }else{
        this.listaCamionesGuia[i].numClientes = this.listaCamionesGuia[i].facturas.length;
      }
  
      this.listaCamionesGuia[i].pesoRestante = this.listaCamionesGuia[i].capacidad - this.listaCamionesGuia[i].peso

      this.actualizar(factura.factura.CLIENTE_ORIGEN, factura.factura.FACTURA, resp.consecutivo)
      
    }
 }

//alert('after')
}
  })



 }


  

}

agregarTodasFacturasUnicoCamion(ruta, camion, fecha){

  this.listaCamionesGuia = [];
  // genera modelo  guia 
let guia = this.crearModeloGuia(ruta, camion, fecha);
guia.zona = ruta;
guia.ruta = ruta;
guia.idCamion = camion.idCamion;
guia.estado = 'INI';
guia.HH = 'nd';
// asignar todas a un camion
console.log(guia, 'guia',ruta, camion,'ruta, camion')
this.datableService.data.forEach(
  cliente =>{

    cliente.facturas.forEach(factura =>{
      console.log(factura,'facturafactura')
      guia.peso += factura.factura.TOTAL_PESO;
      guia.volumen += Number(factura.factura.RUBRO1);;
      factura.idGuia = guia.consecutivo
     guia.facturas.push(factura)

    })
  }
)

guia.pesoRestante = guia.capacidad - guia.peso
guia.numClientes = this.datableService.data.length;
this.listaCamionesGuia.push(guia)

}

actualizar(cienteId: string , facturaId:string, consecutivo){


  for(let i = 0; i < this.datableService.data.length; i++){
 
   if(cienteId == this.datableService.data[i].id ){
 
     this.datableService.data[i].facturas.forEach(factura =>{
 
       if(factura.factura.FACTURA ==  facturaId){
         factura.idGuia = consecutivo ? consecutivo : null;
 
       }
     })
   }
  }
 
 }


async mostrarDetalleGuia(consecutivo, rutaZona, fecha){
 
  const i = this.listaCamionesGuia.findIndex(guia => guia.consecutivo == consecutivo)
let facturas = [];
   if(i >=0){
    facturas = this.listaCamionesGuia[i].facturas;

   }
  const modal = await this.modalCtrl.create({
    component: ListaClientesGuiasPage,
    cssClass: 'large-modal',
    componentProps:{
      facturas:facturas,
      rutaZona:rutaZona,
      fecha:fecha
    }
  });
  modal.present();
      

}


async eliminarTodosCamionesAlert(){


  const alert = await this.alertCtrl.create({
    cssClass: 'my-custom-class',
    header: 'PLANIFICACIÓN DE ENTREGAS',
    message: '¿Desea eliminar todos los elementos de la guia?',
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
        id: 'cancel-button',
        handler: (blah) => {
          console.log('Confirm Cancel: blah');
        }
      }, {
        text: 'Okay',
        id: 'confirm-button',
        handler: () => {

       this.eliminarGuias();
        
        }
      }
    ]
  });

  await alert.present();


   
    
    
    }






















eliminarGuias(){

  this.listaCamionesGuia = [];

  for(let i = 0; i < this.datableService.data.length; i++){
 
    this.datableService.data[i].facturas.forEach(factura =>{

      factura.idGuia = '';

    })
  }
 

}

generarPost(){
   this.idGuiaPostArray = [];

   for(let i = 0; i  < this.listaCamionesGuia.length; i++){

    this.agruparOrdernar(this.listaCamionesGuia[i]);

   }  
 
 }

 completePost(facturas: facturaGuia[], guia){


  let postFacturas = [];

  let postRutero = [];



 const guiaCamion = { 
    idGuia: guia.consecutivo,
    fecha: guia.fecha,
    zona: guia.zona,
    ruta: guia.ruta,
    idCamion: guia.idCamion,
    numClientes: guia.numClientes,
    peso: guia.peso,
    estado:  guia.estado,
    HH: guia.HH,
    volumen: guia.volumen
   }



if(guia.guiaExistente){
  this.guiasService.guiasArrayExistentes.push(guiaCamion)
}else{
   
  this.guiasService.guiasArray.push(guiaCamion)
}
    for(let i =0; i <  facturas.length; i++){

      this.idGuiaPostArray.push(guia.consecutivo)


   




      const actualizarFactura = {
        numFactura: facturas[i].factura.FACTURA,
        tipoDocumento:facturas[i].factura.TIPO_DOCUMENTO,
        despachado: 'S',
        rubro3:  guia.consecutivo,
        U_LATITUD: facturas[i].factura.LATITUD,
        U_LONGITUD: facturas[i].factura.LONGITUD
   }


postFacturas.push(actualizarFactura)

console.log('ostt', postFacturas, actualizarFactura, 'act')
 

    const rutero = {
      idGuia:guia.consecutivo,
      idCliente: facturas[i].factura.CLIENTE_ORIGEN,
      nombre: facturas[i].factura.NOMBRE_CLIENTE,
      direccion:facturas[i].factura.DIRECCION_FACTURA,
      latitud:Number(facturas[i].factura.LATITUD),
      longitud:Number(facturas[i].factura.LONGITUD),
      checkin: null,
      latitud_check: null,
      longitud_check: null,
      observaciones:null,
      estado: 'P',
      bultos: facturas[i].factura.TOTAL_VOLUMEN,
      checkout:null,
      distancia: facturas[i].distancia,
      Duracion: facturas[i].duracion,
      orden_Visita:facturas[i].order_visita
   }

   postRutero.push(rutero)

 /**
  *   const r = this.ruteroService.rutertoPostArray.findIndex(rutero => rutero.idCliente ==  facturas[i].factura.CLIENTE_ORIGEN )
  
   if(r >=0){
    this.ruteroService.rutertoPostArray[i].bultos += facturas[i].factura.TOTAL_VOLUMEN
   }else{
    this.ruteroService.rutertoPostArray.push(rutero)
   }

  */
   
 if(i === facturas.length -1){

 console.log(postRutero,'postRutero')

 this.actualizarFacturasService.insertarFacturas(postFacturas); // POST
   this.guiasService.insertarGuias(guiaCamion).then(resp =>{

    console.log(resp, 'guia insertada')
const i = this.listaCamionesGuia.findIndex( guiaBorrar => guiaBorrar.consecutivo == guia.consecutivo)
console.log(i ,'i ')
if(i >=0){
  this.listaCamionesGuia.splice(i, 1)
}
console.log(this.listaCamionesGuia, ' lista')
this.alertasService.message( 'PLANIFICACION DE ENTREGAS', 'Nueva Guia Generada ' + guia.consecutivo);

    this.ruteroService.insertarPostRutero(postRutero)
   })


/**
 *   console.log(facturas[i].distancia, 'dii')
   this.actualizarFacturasService.insertarFacturas(postFacturas); // POST
   this.guiasService.insertarGuias(guiaCamion).then(resp =>{

    console.log(resp, 'guia insertada')
const i = this.listaCamionesGuia.findIndex( guiaBorrar => guiaBorrar.consecutivo == guia.consecutivo)
console.log(i ,'i ')
if(i >=0){
  this.listaCamionesGuia.splice(i, 1)
}
console.log(this.listaCamionesGuia, ' lista')
this.alertasService.message( 'PLANIFICACION DE ENTREGAS', 'Nueva Guia Generada ' + guia.consecutivo);

    this.ruteroService.insertarPostRutero(postRutero)
   })
 */
/**
 *   
   this.ruteroService.insertarPostRutero(postRutero)
 */
   //this.guiasService.putGuias()
/**
 *   this.guiasService.insertarGuias();  // PUT
  this.guiasService.putGuias();  // PUT
  this.ruteroService.insertarPostRutero();
 */


/**
 *   console.log(this.actualizaFacturaGuiasService.actualizaFacturasArray,'todas las facturas')
  console.log(this.guiasService.guiasArray,' guias nuevas')
  console.log(this.guiasService.guiasArrayExistentes,' guias existentes')
  console.log(this.ruteroService.rutertoPostArray,'ruteros nuevos')
  console.log(this.ruteroService.rutertoPostArrayExistentes,' ruteros existentes')
 */

 }

    }

  
 }




async listaGuiasArray(){
 const modal = await this.modalCtrl.create({
   component:ListaGuiasPostPage,
   componentProps: {
     guias:this.idGuiaPostArray
   }
 }) 

 return modal.present();
 }


 reset(){
   
  this.datableService.data = []
  this.datableService.dataArrayToShow = []
  this.planificacionEntregasService.bultosTotales = 0
  this.planificacionEntregasService.clientesTotales = 0
  this.planificacionEntregasService.pesoTotal = 0
  this.planificacionEntregasService.fecha = null;
  this.listaCamionesGuia = []
  this.Fecha = null;
  this.listaCamionesGuia = []
  this.planificacionEntregasService.rutaFacturasArray = [];
  this.startValue = null;
  this.orderArray = [];
  this.compareArray = [];
 }


}
