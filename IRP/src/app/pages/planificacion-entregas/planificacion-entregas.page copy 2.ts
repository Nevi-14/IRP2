import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, ModalController, AlertController } from '@ionic/angular';
import { ZonasService } from 'src/app/services/zonas.service';
import { RutasService } from 'src/app/services/rutas.service';
import { RutaFacturasService } from 'src/app/services/ruta-facturas.service';
import { RutaZonaService } from 'src/app/services/ruta-zona.service';
import { DataTableService } from 'src/app/services/data-table.service';
import { ServiciosCompartidosService } from 'src/app/services/servicios-compartidos.service';
import { ControlCamionesGuiasService } from 'src/app/services/control-camiones-guias.service';
import { PlanificacionEntregasService } from 'src/app/services/planificacion-entregas.service';
import { AlertasService } from 'src/app/services/alertas.service';
import { ListaCamionesModalPageModule } from '../lista-camiones-modal/lista-camiones-modal.module';
import { ListaCamionesModalPage } from '../lista-camiones-modal/lista-camiones-modal.page';
import { RutaMapaComponent } from '../../components/ruta-mapa/ruta-mapa.component';
import { ControlFacturasPage } from '../control-facturas/control-facturas.page';



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
    public datableService: DataTableService,
    public serviciosCompartidosService: ServiciosCompartidosService,
    public planificacionEntregasService:PlanificacionEntregasService,
    public alertasService: AlertasService,
    public alertCTrl: AlertController


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

    this.planificacionEntregasService.syncRutaFacturas( this.controlCamionesGuiasService.rutaZona.Ruta, this.fecha);
    
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
    component: ListaCamionesModalPageModule,
    cssClass: 'large-modal'
  });

  modal.present();
      
        
  const { data } = await modal.onDidDismiss();

  if(data !== undefined){
    this.controlCamionesGuiasService.borrarFactura(factura, factura.idGuia)
    this.controlCamionesGuiasService.generarGuia(factura, data);
//=============================================================================
// UNA VEZ QUE OBTENEMOS LA INFORMACION DEL CAMION PROCEDEMOS A AGREGAR TODAS
// LAS FACTURAS A UNA SOLA GUIA
//=============================================================================
 
 

      
  }
  
}

//=============================================================================
// REMUEVE UNA FACTURA  LA CUAL SE FILTRA POR MEDIO DEL PARAMETRO CONSECUTIVO 
//QUE SERIA EL IDENTIFICADOR DE CADA GUIA DONDE GUARDAMOS LAS FACTURAS
//=============================================================================

removerGuia(consecutivo){

  
}

//=============================================================================
// MUESTRA UN MODAL CON TODOS LOS CLIENTES DENTRO DE UNA GUIA
//=============================================================================
mostrarDetalleGuia(consecutivo){

 

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
async controlFacturas(factura){


  const modal = await this.modalCtrl.create({
    component: ControlFacturasPage,
    cssClass: 'large-modal',
    componentProps:{
      factura:factura
    }
  });

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
async onOpenMenu(factura) {
 
  let inputArray:any = []

  let nuevaGuia :any =          {
    name: 'radio1',
    type: 'radio',
    label: 'Generar Nueva Guia',
    value: 'value1',
    handler: () => {
      console.log('Radio 1 selected');
      this.controlCamionesGuiasService.borrarFactura(factura, factura.idGuia)
    this.generarNuevaGuia(factura)
      this.alertCTrl.dismiss();
    }
  }

  let agregarFacturaGuiaExistente :any =     {
    name: 'radio2',
    type: 'radio',
    label: 'Agregar Guia Existente',
    value: 'value2',
    handler: () => {
      console.log('Radio 2 selected');

    this.controlCamionesGuiasService.agregarFacturaGuia(factura)
    this.alertCTrl.dismiss();
    }
  }

  let eliminarFacturaGuiaExistente:any =    {
    name: 'radio3',
    type: 'radio',
    label: 'Eliminar Factura Guia Existente',
    value: 'value3',
    handler: () => {

      console.log('Radio 3 selected');

      this.borrarFactura(factura, factura.idGuia);
      this.alertCTrl.dismiss();
    }
  }

  if(factura.idGuia){
    inputArray.push(nuevaGuia,agregarFacturaGuiaExistente,eliminarFacturaGuiaExistente)
  }else{
    inputArray.push(nuevaGuia,agregarFacturaGuiaExistente)
  }


  const alert = await this.alertCTrl.create({
    cssClass: 'alert-menu',
    header: 'Administrar Factura ' + factura.factura.FACTURA,
    message: `
  Te permite generar nuevas guias, ademas de poder agregar facturas a guias existentes o eliminar una factura de una guia
`,
    inputs: inputArray
   
  });

  await alert.present();
}

async onOpenMenuGuias() {
  
  let inputArray:any = []



  let post :any =          {
    name: 'radio1',
    type: 'radio',
    label: 'Guardar Guias',
    value: 'value1',
    handler: () => {
      console.log('Radio 1 selected');
      this.controlCamionesGuiasService.exportarGuias();
 
      console.log('Guia: ', this.controlCamionesGuiasService.listaGuias);
      this.alertCTrl.dismiss();
    }
  }



  let eliminar :any =     {
    name: 'radio2',
    type: 'radio',
    label: 'Asignar todas las factuas a una guia',
    value: 'value2',
    handler: () => {
      console.log('Radio 2 selected');

    this.alertCTrl.dismiss();
    }
  }

  inputArray.push(post,eliminar)

  const alert = await this.alertCTrl.create({
    cssClass: 'alert-menu',
    header: 'Administrar Guias',
    message: `
    Te permite gestionar las guias previamente creadas
`,
    inputs: inputArray,
  });

  await alert.present();
}


detalleGuia(idGuia){

  this.controlCamionesGuiasService.detalleGuia(idGuia)
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


borrarFactura(factura, idGuia){
  this.controlCamionesGuiasService.borrarFactura(factura,idGuia)


}

verificarGuia(guia, i){
  console.log(guia,i)
this.controlCamionesGuiasService.llenarRutero(guia,i)

}
}
