import { Injectable } from '@angular/core';
import { PlanificacionEntregas } from '../models/planificacionEntregas';
import { AlertasService } from './alertas.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ConfiguracionesService } from './configuraciones.service';
import { Rutas } from '../models/rutas';
import { ClientesGuia, Guias, Cliente } from '../models/guia';
import { RuteroMH } from '../models/Rutero';
import { GestionCamionesService } from './gestion-camiones.service';
import * as  mapboxgl from 'mapbox-gl';
import { ActualizarFacturasService } from './actualizar-facturas.service';
import { RuteroService } from './rutero.service';
import { ReporteFacturasPage } from '../pages/reporte-facturas/reporte-facturas.page';
import { AlertController, ModalController } from '@ionic/angular';
import { GuiaEntrega } from '../models/guiaEntrega';
import { Camiones } from '../models/camiones';
import { FacturasNoAgregadasPage } from '../pages/facturas-no-agregadas/facturas-no-agregadas.page';
 
@Injectable({
  providedIn: 'root'
})
export class PlanificacionEntregasService {

  // Varibles Globles

 arregloPlanificacionEntrega: PlanificacionEntregas[]=[];
 errorArray =[]


 // variables Globales Guias
 listaGuias : Guias[] = [];
 rutas:Rutas[] = []
 rutaZona = null;
 fecha:string;
 clientes: ClientesGuia[] = []
 facturasOriginal: ClientesGuia[] = []
 cargarMapa:boolean = false;
 guiasGeneradas:GuiaEntrega[] = [];
 complete = 0;
 facturasNoAgregadas: ClientesGuia[] = [];
continuarRutaOptima = true;
horaFinalAnterior = null;

    // Variables proceso de ordenamiento MAURICIO HERRA

    listos: number = 1;
    total: number = 1;
    actual: number = 0;
    menor:  number = 0;
    i:      number = 0;
    p:      number = 0;
    rutero: RuteroMH[] = [];
    ruteros = []
    idGuiasArray = [];
    contadorPost = 0;
    totalFacturas: number = 0;
    pesoTotal: number = 0;
    totalBultos:number = 0;
    volumenTotal: number = 0;
    bultosTotales: number = 0;
    totalClientes: number = 0;





 constructor(
   private modalCtrl: ModalController,
   public alertCtrl:AlertController,
   private http: HttpClient,  
   public alertasService: AlertasService,
   public configuracionesService: ConfiguracionesService,
   public gestionCamionesService: GestionCamionesService,
   public actualizarFacturasService: ActualizarFacturasService,
   public ruteroService: RuteroService
   
   
   ) { }



 

   limpiarDatos(){
    this.arregloPlanificacionEntrega =[];
    this.errorArray =[]

    this.rutas = [];
      this.clientes  = [];
      this.facturasOriginal = [];
      this.facturasNoAgregadas = [];

      this.listaGuias  = [];
    

      this.rutaZona = null;
      this.fecha = null;


      this.complete = 0;
    
      // Variables proceso de ordenamiento MAURICIO HERRA
    
      this.listos  = 1;
      this.total  = 1;
      this.actual  = 0;
      this.menor  = 0;
      this.i = 0;
      this.p  = 0;
      this.rutero  = [];
    
      this.ruteros = []
      this.idGuiasArray = [];
      this.contadorPost = 0;
      this.totalFacturas  = 0;
      this.pesoTotal = 0;
      this.totalBultos = 0;
      this.volumenTotal = 0;
      this.bultosTotales = 0;
      this.totalClientes = 0;
    

      this.ruteroService.limpiarDatos();
      this.actualizarFacturasService.limpiarDatos();
    

    
    }


   getURL( api: string,identifier?: string ){

    let id = identifier ? identifier : "";
    let test: string = ''
   
    if ( !environment.prdMode ) {
      test = environment.TestURL;
    }

    let URL = this.configuracionesService.company.preURL  + test +   this.configuracionesService.company.postURL + api + id;
    this.configuracionesService.api = URL;

    return URL;

  }

   getPlanificacionEntregas(ruta: string, fecha:string){
    let URL = this.getURL(environment.rutaFacturasURL);
        URL = URL + environment.rutaParam+ ruta + environment.entregaParam + fecha;
    return this.http.get<PlanificacionEntregas[]>(URL);

  }

syncRutaFacturas(ruta:string, fecha:string){
 return  this.getPlanificacionEntregas(ruta, fecha).toPromise();

}





// Creacion de Guias


generarIDGuia(){

  let   consecutivo  = null,
  date               = new Date(this.fecha),  // FECHA HOY
  year               = date.getFullYear(),  // AÑO
  month              = (date.getMonth() + 1).toString().padStart(2, "0"), // MES ACTUAL FORMATO 2 DIGITOS EJEMPLO 01
  day                = date.getDate().toString().padStart(2, "0"), // DIA ACTUAL FORMATO FECHA
  ramdomNumber = Math.floor(1000 + Math.random() * 9000);  // DEVUELVE NUMERO ALEATORIO DE 4 DIGITOS
  consecutivo   = year+''+month+''+day+this.rutaZona.RUTA+'V'+ramdomNumber; // CONCATENAMOS LOS VALORES Y GENERAMOS CONSECUTIVO

  return consecutivo; // DEVUELVE CONSECUTIVO

}


async generarPreListaGuias(camiones:Camiones[]){
let data = [];
for(let i =0; i < camiones.length; i++){

 data.push( this.generarGuia(camiones[i]));
  if(i ==  camiones.length -1){


    return data;
  }
}
 
}


   generarGuia(camion:Camiones) {

    let capacidad = camion.capacidadPeso;
    let id = null; //this.generarIDGuia();
    let guia = {
      idGuia:  id,
      guiaExistente: false,
      verificada: false,
      totalFacturas:0,
      distancia: 0,
      duracion:0,
      zona: this.rutaZona.RUTA,
      nombreRuta:this.rutaZona.DESCRIPCION,
      ruta: this.rutaZona.RUTA,
      fecha: this.fecha,
      numClientes: 0,
      camion:{
        numeroGuia: id,
        chofer:camion.chofer,  
        idCamion: camion.idCamion,
        capacidad: capacidad,
        pesoRestante: capacidad,
        peso: 0 ,
        estado : 'INI',
        HH : 'nd',
        bultos: 0,
        volumen:   camion.capacidadVolumen,
        frio:camion.frio,
        seco:camion.seco,
        HoraInicio:'08:00',
        HoraFin:'20:00'
      },
      clientes:[],
      facturas: []
    }
   
return guia;
    
  }


 agregarFacturaGuiaNueva(idGuia,factura:PlanificacionEntregas){

let i = this.listaGuias.findIndex(guia => guia.idGuia == idGuia);

let cliente:Cliente =  {
  id: factura.CLIENTE_ORIGEN,
  idGuia:null,
  cliente: factura.NOMBRE_CLIENTE,
  latitud: factura.LATITUD,
  longitud:factura.LONGITUD,
  distancia: 0,
  duracion:0,
  direccion:factura.DIRECCION_FACTURA,
  bultosTotales:Number(factura.RUBRO1),
  orden_visita:0,
  HoraInicio:null,
  HoraFin:null
}


let noAgregado = {
  id: factura.CLIENTE_ORIGEN,
  idGuia: null,
  nombre: factura.NOMBRE_CLIENTE,
  marcador: null,
  color: null,
  cambioColor: '#00FF00',
  latitud: factura.LATITUD,
  longitud: factura.LONGITUD,
  seleccionado:  false,
  cargarFacturas:true,
  frio: false,
  seco: false,
  frioSeco: false,
  totalFrio: 0,
  totalSeco: 0,
  totalBultos: 0,
  totalPeso: 0,
  direccion: factura.DIRECCION_FACTURA,
  facturas: [factura]
}

if(i >=0){


  this.listaGuias[i].verificada = false; 
cliente.idGuia = this.listaGuias[i].idGuia; 
factura.ID_GUIA =  this.listaGuias[i].idGuia;;

let c = this.listaGuias[i].clientes.findIndex(clientes => clientes.id == factura.CLIENTE_ORIGEN);

let capacidadCamion = this.listaGuias[i].camion.capacidad;
let pesoActual = this.listaGuias[i].camion.peso;
let pesoFactura = factura.TOTAL_PESO;
 let consultarPesoAntesDeAgregarFactura = pesoActual+pesoFactura;
 
 
 if(consultarPesoAntesDeAgregarFactura > capacidadCamion){
 
  factura.ID_GUIA = null;
  let guia = this.listaGuias.findIndex(guia => guia.idGuia == idGuia );

  if(guia > 0){

   if(this.listaGuias[guia].clientes.length == 0 || this.listaGuias[guia].facturas.length == 0 ){
this.listaGuias.splice(guia, 1);

   }
  }
   
     this.facturasNoAgregadas.push(noAgregado)
 } else if(consultarPesoAntesDeAgregarFactura < capacidadCamion){
  
  if(c >= 0){
    let f =this.listaGuias[i].facturas.findIndex(fact => fact.FACTURA == factura.FACTURA);
    if(f < 0){
      
    
      this.listaGuias[i].facturas.push(factura)
      this.listaGuias[i].totalFacturas += 1;
      this.listaGuias[i].camion.bultos += Number(factura.RUBRO1);
      this.listaGuias[i].camion.peso  += factura.TOTAL_PESO;
      this.listaGuias[i].camion.pesoRestante  =  this.listaGuias[i].camion.capacidad - this.listaGuias[i].camion.peso
  
    }
  } else{

    this.listaGuias[i].clientes.push(cliente)
    this.listaGuias[i].numClientes += 1;
    this.listaGuias[i].facturas.push(factura)
    this.listaGuias[i].totalFacturas += 1;
    this.listaGuias[i].camion.bultos += Number(factura.RUBRO1);
    this.listaGuias[i].camion.peso  += factura.TOTAL_PESO;
    this.listaGuias[i].camion.pesoRestante  =  this.listaGuias[i].camion.capacidad - this.listaGuias[i].camion.peso

  }


    } 
    
}

//this.actualizarValores();
 

}
 borrarFacturaGuia(factura:PlanificacionEntregas){

  let i = this.listaGuias.findIndex(guia => guia.idGuia == factura.ID_GUIA);
  
  if(i >=0){
    this.listaGuias[i].verificada = false;
    this.listaGuias[i].camion.peso  -= factura.TOTAL_PESO;
    this.listaGuias[i].camion.pesoRestante  += factura.TOTAL_PESO
    let facturaEliminar = this.listaGuias[i].facturas.findIndex(fact => fact.CLIENTE_ORIGEN == factura.CLIENTE_ORIGEN)
    if(facturaEliminar >=0){
      this.listaGuias[i].facturas[facturaEliminar].ID_GUIA = null;
      this.listaGuias[i].facturas.splice(facturaEliminar, 1)
      this.listaGuias[i].totalFacturas -= 1;

    }


 

    let cliente = this.listaGuias[i].clientes.findIndex(clientes => clientes.id == factura.CLIENTE_ORIGEN);
  let conteoFacturasCliente = this.listaGuias[i].facturas.filter(cliente => cliente.CLIENTE_ORIGEN == factura.CLIENTE_ORIGEN);

  if(cliente >=0){
    this.listaGuias[i].numClientes -= 1;
    if(conteoFacturasCliente.length  == 0){
      this.listaGuias[i].clientes.splice(cliente, 1)
   
    }
  }
 
 
  if(this.listaGuias[i].numClientes == 0 && this.listaGuias[i].totalFacturas == 0){
    this.listaGuias.splice(i, 1);
  }


    }
  

   console.log(this.listaGuias)
  
  }


importarFacturas(factura:PlanificacionEntregas, seleccionado?:boolean) {
  let cliente = {
    id: factura.CLIENTE_ORIGEN,
    idGuia: null,
    nombre: factura.NOMBRE_CLIENTE,
    marcador: null,
    color: null,
    cambioColor: '#00FF00',
    latitud: factura.LATITUD,
    longitud: factura.LONGITUD,
    seleccionado: seleccionado,
    cargarFacturas:true,
    frio: false,
    seco: false,
    frioSeco: false,
    totalFrio: 0,
    totalSeco: 0,
    totalBultos: 0,
    totalPeso: 0,
    direccion: factura.DIRECCION_FACTURA,
    facturas: [factura]
  }
  let c = this.clientes.findIndex(client => client.id == factura.CLIENTE_ORIGEN);
  factura.SELECCIONADO = true;
  if (c >= 0) {
    this.cargarMapa = true;
    let facturaIndex = this.clientes[c].facturas.findIndex(fact => fact.FACTURA == factura.FACTURA)
    this.clientes[c].seleccionado = seleccionado ? seleccionado : false;
    if (facturaIndex < 0) {
     
      this.clientes[c].facturas.push(factura);

    }else{
   
      this.clientes[c].facturas[facturaIndex].SELECCIONADO = true;
    }

  } else {
    this.totalFacturas += 1;
    this.clientes.push(cliente)
  }

  this.clientes.forEach(cliente => {
    cliente.totalBultos  = 0;
    cliente.totalPeso  = 0;

    let frio = cliente.facturas.filter(f => f.FRIO_SECO == 'F').length
    let seco = cliente.facturas.filter(f => f.FRIO_SECO == 'N').length

    cliente.totalSeco = seco;
    cliente.totalFrio = frio;
    cliente.frio = frio > 0 ? true : false
    cliente.seco = seco > 0 ? true : false
    cliente.frioSeco = frio > 0 && seco > 0 ? true : false
    cliente.color = frio > 0 ? '#0000FF' : '#eed202'


    for (let f = 0; f < cliente.facturas.length; f++) {

      cliente.totalBultos += Number(cliente.facturas[f].RUBRO1);
      cliente.totalPeso += cliente.facturas[f].TOTAL_PESO;

      if(f == cliente.facturas.length -1){

        this.actualizarTotales();
      }
    }

 
  })


}


actualizarTotales(){

  this.totalFacturas  = 0;
  this.pesoTotal = 0;
  this.totalBultos = 0;
  this.volumenTotal = 0;
  this.bultosTotales = 0;
  this.totalClientes = 0;

  this.clientes.forEach(clientes =>{
 if(clientes.seleccionado){
  let facturas = clientes.facturas;
  facturas.forEach(factura =>{
    this.pesoTotal += factura.TOTAL_PESO;
this.volumenTotal += factura.TOTAL_VOLUMEN;
this.totalClientes  = this.clientes.length;
this.totalBultos += Number(factura.RUBRO1);
this.bultosTotales += Number(factura.RUBRO1);
this.totalFacturas +=1;

  })
}
  })
}

borrarGuia(idGuia){

  let i  = this.listaGuias.findIndex(guia =>  guia.idGuia == idGuia);

  if(i >=0){
    this.listaGuias.splice(i,1);
  }

};
borrarCliente(cliente:ClientesGuia){

  for(let f = 0; f < cliente.facturas.length ; f++){
  console.log('cliente', cliente)
  console.log('facturas', cliente.facturas[f])
    if(cliente.facturas[f].ID_GUIA){
      cliente.facturas[f].ID_GUIA = null;
      console.log(this.listaGuias)
      this.borrarFacturaGuia(cliente.facturas[f])
    }
        if(f == cliente.facturas.length -1){
         // this.clientes.splice(i,1)
      
        }
      
        
      }
  
    }
async importarClientes(facturas:PlanificacionEntregas[]) {
  let data:ClientesGuia[] = [];
 

  facturas.forEach(factura =>{
    let cliente = {
      id: factura.CLIENTE_ORIGEN,
      idGuia:null,
      nombre: factura.NOMBRE_CLIENTE,
      marcador:null,
      color:null,
      cambioColor: '#00FF00',
      latitud: factura.LATITUD,
      longitud: factura.LONGITUD,
      seleccionado:false,
      cargarFacturas:true,
      frio:false,
      seco:false,
      frioSeco:false,
      totalFrio:0,
      totalSeco:0,
      totalBultos:0,
      totalPeso:0,
      direccion:factura.DIRECCION_FACTURA,
      facturas: [factura]
    }
    let c = data.findIndex(client => client.id == factura.CLIENTE_ORIGEN);
    if(c>=0){
let f = data[c].facturas.findIndex(fact => fact.FACTURA ==  factura.FACTURA)
if (f < 0){
  data[c].facturas.push(factura)

}
    }else{
      data.push(cliente)
      
    }


  })

  console.log('data', data)
return data;

}
llenarRutero( guia: Guias){

  this.alertasService.presentaLoading('Calculando ruta optima...')

  this.rutero = [];
  let item = new RuteroMH( 0, guia.idGuia,this.configuracionesService.company.company, this.configuracionesService.company.latitud, this.configuracionesService.company.longitud, 0, 0, '', 0, 0, true , null, null);
  this.rutero.push(item);


 for(let i = 0; i < guia.clientes.length; i++){

  let cliente =  guia.clientes[i];

  item = new RuteroMH(cliente.id,  guia.idGuia, cliente.cliente, cliente.latitud, cliente.longitud, cliente.distancia, cliente.duracion, cliente.direccion, cliente.bultosTotales, cliente.orden_visita, false, null, null);
    this.rutero.push( item );

    if(i == guia.clientes.length -1){
      this.ordenaMH(0, guia)
      console.log('Rutero: ', this.rutero);
    
    }

}

 this.rutero;

}


ordenaMH(a: number, guia){

  let m: number;
  let o: number;

  this.getDistancia(a)
    .then( x =>console.log(x, 'final'))
    .then( x => {
      m = this.calcularMenor();
      console.log(m);
      this.rutero[m].asignado = true;
      o = this.sumarOrdenados();
      this.rutero[m].orden_visita = o


      if ( o < this.rutero.length - 1 ){
        this.ordenaMH(m, guia);
      }
      if(o == this.rutero.length -1){

        this.rutero.sort( ( a, b ) => a.orden_visita - b.orden_visita )

console.log('this.rutero', this.rutero)
     //   return
         this.agregarTiempo(guia);
     

        
      }
    },error =>{
      this.alertasService.loadingDissmiss();
      this.alertasService.message('IRP', 'Lo sentimos algo salio mal.')
     
    })
    
}


async getDistancia( a: number ) {


  console.log('ettt', a, this.rutero[a])
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
      console.log('ettt2', a, this.rutero[a],URL,'URL')
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
        console.log('menor', this.rutero[i])


      }
    }
  }
  return indice;
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

async agregarTiempo(guia:Guias){

  let start = guia.camion.HoraInicio.substring(0,2)
  let end = guia.camion.HoraFin.substring(0,2)

 for(let t =1; t < this.rutero.length; t++){

   let date = new Date(guia.fecha);
   let defaultStartTime = new Date(guia.fecha);
   let defaultEndTime =   new Date(guia.fecha);

   if(t == 1){

defaultStartTime.setHours(Number(start))
defaultStartTime.setMinutes(date.getMinutes() + Number(this.rutero[t].duracion.toFixed(0)));
defaultEndTime.setHours(defaultStartTime.getHours())
defaultEndTime.setMinutes( defaultStartTime.getMinutes()+20);

   }else{
     defaultStartTime.setHours( this.rutero[t-1].HoraFin.getHours())
     defaultStartTime.setMinutes(this.rutero[t-1].HoraFin.getMinutes() + Number(this.rutero[t].duracion.toFixed(0)));
     defaultEndTime.setHours(defaultStartTime.getHours())
     defaultEndTime.setMinutes(defaultStartTime.getMinutes()+20);  
   }

  
   if(defaultStartTime.getHours() >=  Number(end) && this.continuarRutaOptima || defaultEndTime.getHours() >=  Number(end) && this.continuarRutaOptima){
       this.alertasService.loadingDissmiss();
       
      const subHeader = 'Ups!. ha excedido el tiempo limite de la guia, ¿Como desea proceder?';

      const alert = await this.alertCtrl.create({
        header:'Alerta IRP',
        subHeader:subHeader,
        cssClass:'custom-alert',
        mode:'ios',
        buttons:[
      
          {
            text:'Continuar con la guia',
            cssClass: 'alert-button-dark',
        handler:()=>{
          this.continuarRutaOptima = false;
      this.agregarTiempo(guia)
      alert.dismiss();
            }
          },
          {
            text:'Crear nueva guia',
            cssClass: 'alert-button-dark',
            handler:()=>{
              guia.verificada = true;
              let remaining = this.rutero.slice(t);
               guia.camion.HoraFin = this.horaFinalAnterior;
         // Para revemover los que exceden de la guia this.rutero.splice(t);
    
         this.gestionCamionesService.syncCamionesToPromise().then(resp =>{
           let facturas = [];
           remaining.forEach(cliente =>{
        
             let facturasCliente = guia.facturas.filter((b) => { return b.CLIENTE_ORIGEN == Number(cliente.id);});
             let index2 = guia.clientes.findIndex(c => c.id == Number(cliente.id));
             if(index2 >=0){
               guia.clientes.splice(index2, 1);
               guia.numClientes -= 1;
             };
    
             facturas.push(...facturasCliente);
           })
    
           facturas.forEach((factura, index) =>{
             let Ifactura =  guia.facturas.findIndex(f =>  f.CLIENTE_ORIGEN == factura.CLIENTE_ORIGEN);
             if(Ifactura >=0){
               guia.facturas.splice(Ifactura, 1)
             }
             //   factura.ID_GUIA = '';
             guia.totalFacturas = guia.facturas.length
             guia.camion.peso -= factura.TOTAL_PESO_NETO
             guia.camion.pesoRestante =     guia.camion.peso - factura.TOTAL_PESO
             guia.camion.volumen -= Number(factura.RUBRO1)
             factura.factura = ''
             factura.TIPO_DOCUMENTO = 'F';
    
    
             if(index == facturas.length-1){
               this.exportarRuteros()  
             // this.facturaNoAgregadas(facturas)
             this.horaFinalAnterior = null;
             this.facturaNoAgregadas(facturas)
             // this.alertasService.message('IRP', 'Ups!. ha excedido el tiempo limite, por favor cambiar la hora de incio y fin de la guia y vuelva a intentar de nuevo!')
             }
           })
         })



             
            }
          }
        ]
      })
      
      await alert.present();

      //this.presentarAlertaFacturas(remaining,subHeader)
        //  timeExceeded  = true;
     // Para revemover los que exceden de la guia this.rutero.splice(t);

/**
 *      this.gestionCamionesService.syncCamionesToPromise().then(resp =>{
       let facturas = [];
       remaining.forEach(cliente =>{
    
         let facturasCliente = guia.facturas.filter((b) => { return b.CLIENTE_ORIGEN == Number(cliente.id);});
         let index2 = guia.clientes.findIndex(c => c.id == Number(cliente.id));
         if(index2 >=0){
           guia.clientes.splice(index2, 1);
           guia.numClientes -= 1;
         };

         facturas.push(...facturasCliente);
       })

       facturas.forEach((factura, index) =>{
         let Ifactura =  guia.facturas.findIndex(f =>  f.CLIENTE_ORIGEN == factura.CLIENTE_ORIGEN);
         if(Ifactura >=0){
           guia.facturas.splice(Ifactura, 1)
         }
         //   factura.ID_GUIA = '';
         guia.totalFacturas = guia.facturas.length
         guia.camion.peso -= factura.TOTAL_PESO_NETO
         guia.camion.pesoRestante =     guia.camion.peso - factura.TOTAL_PESO
         guia.camion.volumen -= Number(factura.RUBRO1)
         factura.factura = ''
         factura.TIPO_DOCUMENTO = 'F';

 
         if(index == facturas.length-1){
           this.exportarRuteros()  
         // this.facturaNoAgregadas(facturas)
         const subHeader = 'Ups!. ha excedido el tiempo limite de la guia, ¿Como desea proceder?';
         this.presentarAlertaFacturas(facturas,subHeader);
         // this.alertasService.message('IRP', 'Ups!. ha excedido el tiempo limite, por favor cambiar la hora de incio y fin de la guia y vuelva a intentar de nuevo!')
         }
       })
     })
 */
   return

   }

   console.log('start', defaultStartTime);
   console.log('end', defaultEndTime);
   this.rutero[t].HoraInicio  = defaultStartTime;
   this.rutero[t].HoraFin = defaultEndTime;

   if(t == this.rutero.length -1){
     console.log('ready to export')
     console.log('guia', guia)
     console.log('inicio',guia.camion.HoraInicio.substring(0,2))
     console.log('duration',this.rutero[t].duracion)
     console.log('Fecha',guia.fecha)
     console.log('mls',':00')
guia.verificada = true;
if(!this.continuarRutaOptima){
  guia.camion.HoraFin = String(this.rutero[this.rutero.length -1].HoraFin.getHours()).padStart(2, '0') +':'+String(this.rutero[this.rutero.length -1].HoraFin.getMinutes()).padStart(2, '0')
}

 
     this.exportarRuteros();
   }
 }
}


async presentarAlertaFacturas(facturas, subHeader){

const alert = await this.alertCtrl.create({
  header:'Alerta IRP',
  subHeader:subHeader,
  cssClass:'custom-alert',
  mode:'ios',
  buttons:[

    {
      text:'Cambiar La Hora Inicio y Fin en la guia',
      cssClass: 'alert-button-dark',
      handler:()=>{

    alert.dismiss();
      }
    },
    {
      text:'Crear nueva guia',
      cssClass: 'alert-button-dark',
      handler:()=>{
        this.facturaNoAgregadas(facturas)
        console.log('new')
      }
    }
  ]
})

await alert.present();

}
async facturaNoAgregadas(facturas){
const modal = await this.modalCtrl.create({
  component:FacturasNoAgregadasPage,
  cssClass:'ui-modal',
  componentProps:{
    facturas: await this.importarClientes(facturas)
  }
})
await modal.present();

}

async exportarRuteros(){
  let distancia = 0;
  let duracion = 0;

  for(let i =0; i <  this.rutero.length; i++){

    distancia += this.rutero[i].distancia
    duracion += this.rutero[i].duracion
    if(i ==  this.rutero.length -1){
      let index = this.listaGuias.findIndex(guia => guia.idGuia ==this.rutero[i].idGuia )
      if(index >=0){

        this.listaGuias[index].clientes = [];
        this.listaGuias[index].distancia = distancia;
        this.listaGuias[index].duracion = duracion;
        this.listaGuias[index].clientes  = this.rutero.slice(1);
      
      }
    }

    if(i == this.rutero.length-1 ){
      console.log('loading has been dissmissed')
      this.alertasService.loadingDissmiss();
      return this.rutero;
    }
  }

}
exportarGuias(){
  
  this.idGuiasArray = [];
  
let  verificarGuias = this.listaGuias.filter(guia => guia.verificada == false);
if(verificarGuias.length > 0){
 this.alertasService.message('Planificación de entregas','Ups!. Todas las guias deben de ser verificadas!. Guias pendientes : ' + verificarGuias.length)

 return
}

  for(let i = 0; i < this.listaGuias.length; i++){
  if(this.listaGuias[i].verificada){
   console.log(this.listaGuias[i],'exporting')

   let guia = this.listaGuias[i];
   let facturas = [];
   this.listaGuias[i].facturas.forEach(factura =>{
    facturas.push(factura)

   })

   let rutero = this.listaGuias[i].clientes;


   console.log('guia',guia)
   
   console.log('facturas',facturas)
   
   console.log('rutero',rutero)
  // return
   this.completePost(guia,facturas,rutero);
  }

 }
 
}   




completePost(guia: Guias, facturas:PlanificacionEntregas[], ruteros:Cliente[]){


  let postFacturas = [];
  let postRutero = [];
 

  let guiaaa:GuiaEntrega = {
     idGuia: guia.idGuia,
     fecha:new Date( guia.fecha),
     zona: guia.zona,
     ruta: guia.ruta,
     idCamion: guia.camion.idCamion,
     numClientes: guia.numClientes,
     peso: guia.camion.peso,
     estado: '',
     HH: '',
     volumen: 0
  }
  this.guiasGeneradas.push(guiaaa)
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

  this.idGuiasArray.push(guiaCamion.idGuia)

  for(let i =0; i <  facturas.length; i++){

    const actualizarFactura = {
      numFactura:   facturas[i].FACTURA,
      tipoDocumento:facturas[i].TIPO_DOCUMENTO,
      Fecha:        new Date(),
      despachado:   'S',
      rubro3:       guia.idGuia,
      U_LATITUD:    facturas[i].LATITUD,
      U_LONGITUD:   facturas[i].LONGITUD,
      Fecha_Entrega: facturas[i].FECHA_ENTREGA,

    }
    postFacturas.push(actualizarFactura) 
  }

  for (let j = 0; j< ruteros.length; j++){

    console.log(ruteros[j].distancia)
      
    const rut = {
      idGuia:guia.idGuia,
      idCliente:ruteros[j].id,
      nombre: ruteros[j].cliente,
      direccion:ruteros[j].direccion,
      latitud:ruteros[j].latitud,
      longitud:ruteros[j].longitud,
      checkin: null,
      latitud_check: null,
      longitud_check: null,
      observaciones:null,
      estado: 'P',
      bultos:ruteros[j].id,
      checkout:null,
      distancia: ruteros[j].distancia,
      Duracion: ruteros[j].duracion,
      orden_Visita:ruteros[j].orden_visita
    }
    
    postRutero.push(rut)
    
    if(j === ruteros.length -1){
      this.alertasService.presentaLoading('Guardando guias..')
      console.log(postFacturas,'postFacturas',)
      let index =  this.listaGuias.findIndex(filtrar => filtrar.idGuia == guia.idGuia);
      if(index >=0){
        //   this.listaGuias.splice(index,1)

        if(this.listaGuias[index].guiaExistente){
          this.putGuiaToPromise(guiaCamion).then(resp =>{
            this.ruteroService.insertarPostRutero(postRutero).then(resp =>{
              this.actualizarFacturasService.insertarFacturas(postFacturas).then(resp =>{
                this.complete += 1;
                console.log('completado')

                if(this.complete == this.listaGuias.length){
                  this.guiasPost();
                  this.limpiarDatos();
                  this.alertasService.loadingDissmiss();
                }
              });
            })
          });
        }else{
          this.postGuiaToPromise(guiaCamion).then(resp =>{
            this.ruteroService.insertarPostRutero(postRutero).then(resp =>{
              this.actualizarFacturasService.insertarFacturas(postFacturas).then(resp =>{
                this.complete += 1;
                console.log('completado')

                if(this.complete == this.listaGuias.length){
           
                  this.guiasPost();
                  this.limpiarDatos();
                  this.alertasService.loadingDissmiss();
                
                }
              });
            })
          })
        }
        console.log(guiaCamion, this.listaGuias[index])
     
        return
      }
        //  postFacturas = []
          //postRutero = [];

    }
  }
}

async guiasPost(){
  const modal = await this.modalCtrl.create({
    component:ReporteFacturasPage,
    mode:'ios',
    cssClass:'ui-modal',
    componentProps:{
      guias:this.guiasGeneradas
    }
  });

  return modal.present();
}



//   GET  POST  PUT APIS

private getGuiaEstado( estado:string ){
  let test: string = ''
  if ( !environment.prdMode ) {
    test = environment.TestURL;
  }
  let URL = this.getURL( environment.guiasURL);
      URL = URL + environment.guiasURLEstadoParam +estado;
  this.configuracionesService.api = URL;
  return this.http.get<GuiaEntrega[]>(URL);


}
private postGuia (guia:any){
  const URL = this.getURL( environment.guiasURL );
  const options = {
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }
  };

  return this.http.post( URL, JSON.stringify(guia), options );

}

private putGuia (guia:any,id:string){
  let URL = this.getURL( environment.guiasURL );
  const options = {
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }
  };
URL = URL + environment.idParam + id
  return this.http.put( URL, JSON.stringify(guia), options );

}
getGuiaEstadoToPromise(estado){

  return   this.getGuiaEstado(estado).toPromise();
 
   }
postGuiaToPromise(guia:any){
 return  this.postGuia( guia).toPromise();

}

putGuiaToPromise(guia:any){
  let id = guia.idGuia;
  return  this.putGuia( guia, id).toPromise();
 
 }

}
