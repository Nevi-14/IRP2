import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, ModalController, AlertController } from '@ionic/angular';
import { ZonasService } from 'src/app/services/zonas.service';
import { RutasService } from 'src/app/services/rutas.service';
import { RutaFacturasService } from 'src/app/services/ruta-facturas.service';
import { RutaZonaService } from 'src/app/services/ruta-zona.service';
import { ServiciosCompartidosService } from 'src/app/services/servicios-compartidos.service';
import { ControlCamionesGuiasService } from 'src/app/services/control-camiones-guias.service';
import { PlanificacionEntregasService } from 'src/app/services/planificacion-entregas.service';
import { AlertasService } from 'src/app/services/alertas.service';
import { ListaCamionesModalPage } from '../lista-camiones-modal/lista-camiones-modal.page';
import { RutaMapaComponent } from '../../components/ruta-mapa/ruta-mapa.component';
import { ControlFacturasPage } from '../control-facturas/control-facturas.page';
import { DatatableService } from 'src/app/services/datatable.service';


@Component({
  selector: 'app-planificacion-entregas',
  templateUrl: './planificacion-entregas.page.html',
  styleUrls: ['./planificacion-entregas.page.scss'],
})
export class PlanificacionEntregasPage implements OnInit {


  constructor(

    public modalCtrl: ModalController, 
    public rutas:RutasService, 
    public zonas:ZonasService, 
    public rutaFacturas: RutaFacturasService , 
    public rutaZonas: RutaZonaService,
    public controlCamionesGuiasService: ControlCamionesGuiasService,
    public serviciosCompartidosService: ServiciosCompartidosService,
    public planificacionEntregasService:PlanificacionEntregasService,
    public alertasService: AlertasService,
    public alertCTrl: AlertController,
    public datableService: DatatableService


  ) { }

  @ViewChild(IonSlides) slides: IonSlides;

  avatarSlide = {

    slidesPerView: 3

    
  }

//============================================================================= 
// IMAGEN DEL BOTON DE CAMION 
//=============================================================================

image = '../assets/icons/delivery-truck.svg'


//=============================================================================
// OBJETO QUE TIENE LA INFORMACION DE RUTA Y ZONA RUTA, ZONA, DESCRIPCION
//=============================================================================

rutaZona = null;

//=============================================================================
// VARIABLE TIPO STRING QUE RECIBE EL VALOR DE FECHA RETORNO DEL CALENDARIO
//=============================================================================

 fecha:string;

//=============================================================================
// VARIABLES VERDADERO FALSO UTILIZADAS PARA VALIDAR FRIO -  SECO
//=============================================================================

 verdadero = true;

 falso = false;


 limpiarDatos(){

 }

  ngOnInit() {

    // RESET DATATABLE SERVICE
    // RESET PLANIFICACION ENTREGAS SERVICE
    // RESET CAMIONES GUIAS SERVICE

    this.limpiarDatos();
  }


//=============================================================================
// SINCRONIZA LAS RUTAS Y FACTURAS BASADO EN LA RUTA Y FECHA
//=============================================================================

  cargarDatos(){

    this.planificacionEntregasService.syncRutaFacturas( this.controlCamionesGuiasService.rutaZona.Ruta, this.fecha).then(resp =>{

      this.datableService.totalElements = resp.length;
   this.datableService.agruparElementos(resp, 'CLIENTE',[ {name:'idGuia',default:false},{name:'factura',default:true}]).then(array =>{

    this.datableService.totalGroupElements = array.length;
    console.log('arreglo agrupado',array)
    
     this.datableService.generarDataTable(array, 10).then(resp =>{
       
      this.datableService.totalPages = resp.length;

  this.datableService.dataTableArray = resp;
        console.log('arreglo paginado',resp)
      
       }) 
 

    })
;


    });

 
    
  }




  slidePrev() {
    this.slides.slidePrev();
  }
  slideNext() {
    
    this.slides.slideNext();
  }

//=============================================================================
// DESPLIEGA UN MODAL CON LAS RUTAS Y ZONAS UNA VEZ SELECCIONADA LA OPCION 
// DESPLIEGA UN CALENDARIO PARA SELECCIONAR LA FECHA 
//=============================================================================

configuracionZonaRuta(){

//=============================================================================
// SERVICIO COMPARTIDO EN VARIAS VITAS QUE MUESTRA LAS RUTAS DISPONIBLES 
// Y DEVUELVE EL VALOR SELECCIONADO
//=============================================================================

 const ruta =  this.serviciosCompartidosService.listaRutasModal();
//=============================================================================
// PROMESA QUE CONSULTA QUE HAYA DEVUELTO UN VALOR
//=============================================================================


  ruta.then(valor =>{
  
    if(valor !== undefined){
    
      this.controlCamionesGuiasService.rutaZona = null;
      this.controlCamionesGuiasService.rutaZona = valor;
      
//=============================================================================
// SERVICIO COMPARTIDO EN VARIAS VITAS QUE MUESTRA UN CALENDARIO Y RETORNA 
// EL VALOR DE LA FECHA A CONSULTAR 
//=============================================================================

      this.calendarioModal();
  
     }
  
   
  })
  
  }
  

//=============================================================================
// SERVICIO COMPARTIDO EN VARIAS VITAS QUE MUESTRA UN CALENDARIO Y RETORNA EL VARLOR
// DE LA FECHA A CONSULTAR Y LUEGO SINCRONIZA 
// LAS RUTAS Y FACTURAS BASADO EN LA RUTA Y FECHA EL PARAMETRO HACE REFERENCIA 
// AL TIPO DE FORMATO QUE LE QUEREMOS ASIGNAR A LA FECHA 
// YA SEA '/' -> 2022/03/03, '-' 2022-03-03 Y EN CASO DE SER VACIO RETORNA EL VALOR COMO NEW DATE()
//=============================================================================
  calendarioModal(){

   const valorRetorno = this.serviciosCompartidosService.calendarioModal('/');

   valorRetorno.then(valor =>{
    if(valor !== undefined){
 
      this.fecha = valor
      this.controlCamionesGuiasService.fecha = valor;
   this.cargarDatos();

     }

   
  })
}
//============================================================================= 
// MODAL GESTION DE ERRORES DE CADA UNO DE LOS PROCESOS INVOLUCRADOS 
//=============================================================================


gestionErrores(){

  this.alertasService.gestorErroresModal(this.planificacionEntregasService.errorArray);
}


//=============================================================================
// GENERA EL POST DE ACTUALIZAR FACTURAS, INSERTAR GUIAS Y INSERTAR RUTERO
//=============================================================================

generarPost(){



this.rutaZona = null;

}


//=============================================================================
// SERVICIO COMPARTIDO EN VARIAS VITAS QUE MUESTRA LA LISTA DE CAMIONES Y DEVUELVE EL VALOR SELECCIONADO
//=============================================================================

async listaCamiones(factura){

  const modal = await this.modalCtrl.create({
    component: ListaCamionesModalPage,
    cssClass: 'large-modal'
  });

  modal.present();
      
        
  const { data } = await modal.onDidDismiss();

  if(data !== undefined){
    this.controlCamionesGuiasService.borrarFactura(factura)
    this.controlCamionesGuiasService.generarGuia(factura, data);
//=============================================================================
// UNA VEZ QUE OBTENEMOS LA INFORMACION DEL CAMION PROCEDEMOS A AGREGAR TODAS
// LAS FACTURAS A UNA SOLA GUIA
//=============================================================================
 
 

      
  }
  
}



async mapa(guia){

  const modal = await this.modalCtrl.create({
    component: RutaMapaComponent,
    cssClass: 'large-modal',
    componentProps:{
      guia:guia,
      lngLat: [ -84.14123589305028, 9.982628288210657 ],
      height: '100%',
      width:' 100%',
      interactive: true
    }
  });

  modal.present();
      
        
  const { data } = await modal.onDidDismiss();

  if(data !== undefined){

    console.log(data, 'data')

 

      
  }
 

}
//=============================================================================
// NOS PERMITE GENERAR UNA NUEVA GUIA POR MEDIO DE UNA FACTURA
//=============================================================================

async generarNuevaGuia(factura){


  const modal = await this.modalCtrl.create({
    component: ListaCamionesModalPage,
    cssClass: 'large-modal'
  });

  modal.present();
      
        
  const { data } = await modal.onDidDismiss();

  if(data !== undefined){

    console.log(data, 'data')
    this.controlCamionesGuiasService.generarGuia(factura, data.camion);
//=============================================================================
// UNA VEZ QUE OBTENEMOS LA INFORMACION DEL CAMION PROCEDEMOS A AGREGAR TODAS
// LAS FACTURAS A UNA SOLA GUIA
//=============================================================================
 
 

      
  }
 

}


 async obtenerArreglo(){

  const facturas = [];

   this.datableService.dataTableArray.forEach(cliente =>{

    for(let i =0; i < cliente.length; i++){

      for( let j = 0; j < cliente[i].length; j++){
     let factura = cliente[i][j];

        facturas.push(factura);
    

      }
  
    };
  
  });
  return facturas;
}
 controlFacturas(factura){

 this.obtenerArreglo().then(resp =>{
console.log(resp, 'fatura array')
  this.modalControlFacturas(factura, resp)
 })

}

async modalControlFacturas(factura, facturas){

const modal = await this.modalCtrl.create({
  component: ControlFacturasPage,
  cssClass: 'large-modal',
  componentProps:{
    factura:factura,
    facturas: facturas
  },
  id:'control-facturas'
});
console.log(facturas,'facturasfacturasfacturas')
modal.present();
    
      
const { data } = await modal.onDidDismiss();

if(data !== undefined){

  console.log(data, 'data')
//  this.controlCamionesGuiasService.generarGuia(factura, data.camion);
//=============================================================================
// UNA VEZ QUE OBTENEMOS LA INFORMACION DEL CAMION PROCEDEMOS A AGREGAR TODAS
// LAS FACTURAS A UNA SOLA GUIA
//=============================================================================



    
}
}


detalleGuia(guia){

  this.controlCamionesGuiasService.detalleGuia(guia)
}

async borrarGuia(idGuia){
  const alert = await this.alertCTrl.create({
    cssClass: 'my-custom-class',
    header: 'Planificacion Entregas!',
    message: `Desea eliminar la guia <strong>${idGuia}</strong>`,
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel',
        cssClass: 'secondary',
        id: 'cancel-button',
        handler: (blah) => {
          console.log('Confirm Cancel: blah');
        }
      }, {
        text: 'Continuar',
        id: 'confirm-button',
        handler: () => {
          this.controlCamionesGuiasService.borrarGuia(idGuia)
        }
      }
    ]
  });

  await alert.present();
}




verificarGuia(guia){

this.controlCamionesGuiasService.llenarRutero(guia)

}
}
