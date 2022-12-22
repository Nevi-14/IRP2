import { Injectable } from '@angular/core';
import { PlanificacionEntregas } from '../models/planificacionEntregas';
import { ModalController } from '@ionic/angular';
import { AlertasService } from './alertas.service';
import { PlanificacionEntregasService } from './planificacion-entregas.service';
import { RuteroMH } from '../models/Rutero';
import { GuiasService } from './guias.service';
import { RuteroService } from './rutero.service';
import { ActualizarFacturasService } from './actualizar-facturas.service';
import { GestionCamionesService } from './gestion-camiones.service';
import { Camiones } from '../models/camiones';
import { DatatableService } from './datatable.service';
import * as  mapboxgl from 'mapbox-gl';
import { Cliente, ClientesGuia, Guias } from '../models/guia';
import { ReporteFacturasPage } from '../pages/reporte-facturas/reporte-facturas.page';
import { GuiaEntrega } from 'src/app/models/guiaEntrega';
import { Rutas } from '../models/rutas';
//=============================================================================
// INTERFACE DE ORDEN ENTREGA CLIENTES
//=============================================================================



 

//=============================================================================
// INTERFACE DE  MODELO GUIA DE ENTREGA
//=============================================================================
@Injectable({

  providedIn: 'root'

})

export class ControlCamionesGuiasService {
 cargarMapa = false;
   guiasGeneradas:GuiaEntrega[] = [];
    clientes: ClientesGuia[] = []
    facturasOriginal: ClientesGuia[] = []
    facturasNoAgregadas: PlanificacionEntregas[] = [];
    preListaGuias:Guias[] = []
    listaGuias : Guias[] = [];
  //  clientes:ClientesGuia[] = []
//=============================================================================
// VARIABLES GLOBALES
//=============================================================================
    camionLleno = false;
    rutaZona = null;
    fecha:string;
    lngLat: [number, number] = [ -84.14123589305028, 9.982628288210657 ];
    orderArray = [];
    compareArray  : Cliente[] = [];
    complete = 0;
    rutas:Rutas[] = []
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
    public modalCtrl: ModalController,
    public alertasService: AlertasService,
    public planificacionEntregasService: PlanificacionEntregasService,
    public guiasService: GuiasService,
    public ruteroService: RuteroService,
    public actualizarFacturasService: ActualizarFacturasService,
    public gestionCamionesService: GestionCamionesService,
    public datatableService: DatatableService

  ) {
  

 }


//=============================================================================
// LIMPIA LOS DATOS DEL SERVICIO
//=============================================================================

limpiarDatos(){
this.rutas = [];
  this.clientes  = [];
  this.facturasOriginal = [];
  this.facturasNoAgregadas = [];
  this.preListaGuias = [];
  this.listaGuias  = [];

  this.camionLleno = false;
  this.rutaZona = null;
  this.fecha = null;
  this.orderArray = [];
  this.compareArray    = [];
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

  this.guiasService.limpiarDatos();
  this.ruteroService.limpiarDatos();
  this.actualizarFacturasService.limpiarDatos();
  this.datatableService.limpiarDatos()
  this.planificacionEntregasService.limpiarDatos();


}


actualizarTotales(){

  this.totalClientes = 0;
  this.pesoTotal = 0;
  this.totalBultos = 0;
  this.volumenTotal = 0;
  this.totalFacturas = 0;

  for(let i =0; i< this.clientes.length; i++){


if(this.clientes[i].seleccionado){
  this.totalClientes += 1;
  this.clientes[i].facturas.forEach( factura =>{

    this.pesoTotal += factura.TOTAL_PESO;
    this.totalBultos += Number(factura.RUBRO1);
    this.volumenTotal += factura.TOTAL_VOLUMEN;
    this.totalFacturas += 1;
    
    })
}

    if(i == this.clientes.length -1){


console.log('fin')
    }
  }
}


  //=============================================================================
  // GENERA EL ID DE LA GUIA
  //=============================================================================

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


actualizarValores(){
  this.totalFacturas  = 0;
  this.pesoTotal = 0;
  this.totalBultos = 0;
  this.volumenTotal = 0;
  this.bultosTotales = 0;
  this.totalClientes = 0;


  this.clientes.forEach(clientes =>{

    let facturas = clientes.facturas;
    facturas.forEach(factura =>{
      this.pesoTotal += factura.TOTAL_PESO;
this.volumenTotal += factura.TOTAL_VOLUMEN;
this.totalClientes  = this.clientes.length;
this.totalBultos += Number(factura.RUBRO1);
this.bultosTotales += Number(factura.RUBRO1);
this.totalFacturas +=1;

    })
  })
}


//=============================================================================
// OPCIONES DE  GUIAS
//=============================================================================



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

if(i >=0){


  this.listaGuias[i].verificada = false; 
cliente.idGuia = this.listaGuias[i].idGuia; 
factura.ID_GUIA =  this.listaGuias[i].idGuia;;

let c = this.listaGuias[i].clientes.findIndex(clientes => clientes.id == factura.CLIENTE_ORIGEN);

let capacidadCamion = this.listaGuias[i].camion.capacidad;
let pesoActual = this.listaGuias[i].camion.peso;
let pesoFactura = factura.TOTAL_PESO;
 let consultarPesoAntesDeAgregarFactura = pesoActual+pesoFactura;
 
if(consultarPesoAntesDeAgregarFactura < capacidadCamion){

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


    }else{
   factura.ID_GUIA = null;
   let guia = this.listaGuias.findIndex(guia => guia.idGuia == idGuia );

   if(guia > 0){

    if(this.listaGuias[guia].clientes.length == 0 || this.listaGuias[guia].facturas.length == 0 ){
this.listaGuias.splice(guia, 1);

    }
   }
      this.facturasNoAgregadas.push(factura)
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

  if(conteoFacturasCliente.length  == 0){
    this.listaGuias[i].clientes.splice(cliente, 1)
    this.listaGuias[i].numClientes -= 1;
  }
 
  if(this.listaGuias[i].numClientes == 0 && this.listaGuias[i].totalFacturas == 0){
    this.listaGuias.splice(i, 1);
  }


    }
  

   console.log(this.listaGuias)
  
  }


  llenarRutero( guia: Guias){

    this.alertasService.presentaLoading('Calculando ruta optima...')
  
    this.rutero = [];
    let item = new RuteroMH( 0, guia.idGuia,'ISLEÑA', 9.982628288210657, -84.14123589305028, 0, 0, '', 0, 0, true , null, null);
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
    //this.alertasService.presentaLoading('Verificando Guia')
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
       
  
        //  this.alertasService.loadingDissmiss();  
          
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
  agregarTiempo(guia:Guias){
    
     guia.verificada = true;
    let start = guia.camion.HoraInicio.substring(0,2)
    let end = guia.camion.HoraFin.substring(0,2)

    //return
    for(let t =1; t < this.rutero.length; t++){

      let date = new Date('2022/10/26');
      let defaultStartTime = new Date(date);
      let defaultEndTime =   new Date(date);
      //return
      if(t == 1){
       // defaultStartTime =   new Date(date +' '+  start+':'+ this.rutero[t].duracion.toFixed(0)+':00');
        //defaultEndTime =  new Date(date +' '+ defaultStartTime.getHours()+':'+String(defaultStartTime.getMinutes()+20)+':00');
        //defaultEndTime.setMinutes(defaultStartTime.getMinutes()+20);


   defaultStartTime.setHours(Number(start))
   defaultStartTime.setMinutes(date.getMinutes() + Number(this.rutero[t].duracion.toFixed(0)));
   defaultEndTime.setHours(defaultStartTime.getHours())
   defaultEndTime.setMinutes(date.getMinutes() + defaultStartTime.getMinutes()+20);


        console.log(date)
        console.log('start', start)
        console.log('end', end)
        console.log('duracion', this.rutero[t].duracion.toFixed(0))
        console.log('defaultStartTime', defaultStartTime)
        console.log('defaultEndTime', defaultEndTime)
 




      }else{
        defaultStartTime.setHours( this.rutero[t-1].HoraFin.getHours())
        defaultStartTime.setMinutes(this.rutero[t-1].HoraFin.getMinutes() + Number(this.rutero[t-1].duracion.toFixed(0)));
        defaultEndTime.setHours(defaultStartTime.getHours())
        defaultEndTime.setMinutes(date.getMinutes() + defaultStartTime.getMinutes()+20);
        

      }
  
      console.log('time', defaultStartTime, defaultEndTime)

     
      if(defaultStartTime.getHours() >=  Number(end) || defaultEndTime.getHours() >=  Number(end)){
        this.alertasService.loadingDissmiss();
        //alert('finished')
  
        let remaining = this.rutero.slice(t);
        this.rutero.splice(t);
        console.log('remaining', remaining)
        this.gestionCamionesService.syncCamionesToPromise().then(resp =>{
          let facturas = [];
          remaining.forEach(cliente =>{
       
            let facturasCliente = guia.facturas.filter((b) => { return b.CLIENTE_ORIGEN == Number(cliente.id);});
            let index2 = guia.clientes.findIndex(c => c.id == Number(cliente.id));
            if(index2 >=0){
              guia.clientes.splice(index2, 1);
              guia.numClientes -= 1;
            };
  
            console.log('cliente f', facturasCliente)
            facturas.push(...facturasCliente);
          })
          console.log('facturas',facturas)
  
          facturas.forEach((factura, index) =>{
            let Ifactura =  guia.facturas.findIndex(f =>  f.CLIENTE_ORIGEN == factura.CLIENTE_ORIGEN);
            if(Ifactura >=0){
              guia.facturas.splice(Ifactura, 1)
            }
            //   factura.idGuia = '';
            guia.totalFacturas = guia.facturas.length
            guia.camion.peso -= factura.TOTAL_PESO_NETO
            guia.camion.pesoRestante =     guia.camion.peso - factura.TOTAL_PESO
            guia.camion.volumen -= Number(factura.RUBRO1)
            //factura.factura.idGuia = ''
            factura.TIPO_DOCUMENTO = 'F';
  
            console.log('length', facturas.length, 'index', index, 'index-1', index-1)
            if(index == facturas.length-1){
              this.exportarRuteros()
             // this.generarGuia(resp[0],false, facturas);
            }
          })
        })
      
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
        this.alertasService.loadingDissmiss();
        console.log('rutero', this.rutero)
        this.exportarRuteros();
      }
    }
  }
  async exportarRuteros(){
    let distancia = 0;
    let duracion = 0;
    console.log('exporting', this.rutero)
    for(let i =0; i <  this.rutero.length; i++){
  
      distancia += this.rutero[i].distancia
      duracion += this.rutero[i].duracion
      if(i ==  this.rutero.length -1){
        let index = this.listaGuias.findIndex(guia => guia.idGuia ==this.rutero[i].idGuia )
        if(index >=0){
  
          this.listaGuias[index].clientes = [];
          this.listaGuias[index].verificada = true;
          this.listaGuias[index].distancia = distancia;
          this.listaGuias[index].duracion = duracion;
          this.listaGuias[index].clientes  = this.rutero.slice(1);
          let guia = this.listaGuias[index]
        }
      }
  
      if(i == this.rutero.length-1 ){
        return this.rutero;
      }
    }
  
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
exportarGuias(){
  
  this.idGuiasArray = [];
  
let  verificarGuias = this.listaGuias.filter(guia => guia.verificada == false);
if(verificarGuias.length > 0){
 this.alertasService.message('Planificación de entregas','Ups!. Todas las guias deben de ser verificadas!. Guias pendientes : ' + verificarGuias.length)

 return
}
this.alertasService.presentaLoading('Guardando Datos..')
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
          this.guiasService.putGuias(guiaCamion).then(resp =>{
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
          this.guiasService.insertarGuias(guiaCamion).then(resp =>{
            this.ruteroService.insertarPostRutero(postRutero).then(resp =>{
              this.actualizarFacturasService.insertarFacturas(postFacturas).then(resp =>{
                this.complete += 1;
                console.log('completado')

                if(this.complete == this.listaGuias.length){
                  this.modalCtrl.dismiss(true);
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

borrarGuia(idGuia){

  let i  = this.listaGuias.findIndex(guia =>  guia.idGuia == idGuia);

  if(i >=0){
    this.listaGuias[i].verificada = false;
    let facturas = this.listaGuias[i].facturas;

    for(let f =0; f < facturas.length; f++){
      console.log('facturas[i]', facturas[i])
      facturas[f].ID_GUIA = null;
      console.log('facturas[i]', facturas[f])
      if(f === facturas.length -1){
        this.listaGuias.splice(i,1);
      }
    }
  }

};


borrarTodasLasGuias(){

  this.listaGuias = [];
  this.planificacionEntregasService.borrarIdGuiaFacturas();

};


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
    seleccionado: seleccionado ? seleccionado : false,
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
  if (c >= 0) {

    let facturaIndex = this.clientes[c].facturas.findIndex(fact => fact.FACTURA == factura.FACTURA)

    if (facturaIndex < 0) {

      this.clientes[c].facturas.push(factura);
      console.log('found', this.clientes[c].facturas)

    }


  } else {
    this.totalFacturas += 1;
    console.log('new', cliente)
    this.clientes.push(cliente)
  }




}

importarFacturas2(facturas:PlanificacionEntregas[]) {
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
return data;

}



// PLANIFICACION ENTREGA


// ORDENAR ARREGLO


odenar(array:ClientesGuia[])

{
  
  for (let a = 1; a < array.length; a++){
    for (let b = 0; b < a ; b++){
      if (Number(array[b].id) < Number(array[a].id)) {
        var x = array[a];
        array[a] = array[b];
        array[b] = x;
        console.log('a b', a, b)
      }      
    }
    if(a == array.length -1){
  
return array;
   
    }
  }

}

//  BORRAR LCIENTE

borrarCliente(cliente:ClientesGuia){

  let i = this.clientes.findIndex(c => c.id == cliente.id);
  
  if(i >=0 && this.clientes[i].facturas){
  
  console.log('this.clientes[i]', this.clientes[i])
  console.log(this.listaGuias)
  let facturas = this.clientes[i].facturas;
  for(let f = 0; f < facturas.length ; f++){
  
if(this.clientes[i].idGuia){

  console.log(this.listaGuias)
  this.borrarFacturaGuia(facturas[f])
}
    if(f == facturas.length -1){
     // this.clientes.splice(i,1)
  
    }
  
    
  }
  
   
  }
  
    }
    



}


