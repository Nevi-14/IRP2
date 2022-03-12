import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ZonasService } from 'src/app/services/zonas.service';
import { RutasService } from 'src/app/services/rutas.service';
import { RutaFacturasService } from 'src/app/services/ruta-facturas.service';
import { RutaZonaService } from 'src/app/services/ruta-zona.service';
import { DataTableService } from 'src/app/services/data-table.service';
import { ServiciosCompartidosService } from 'src/app/services/servicios-compartidos.service';
import { PlanificacionEntregasService } from '../../services/planificacion-entregas.service';
import { ListaCamionesModalPage } from '../lista-camiones-modal/lista-camiones-modal.page';
import { AlertasService } from '../../services/alertas.service';
import { ControlCamionesGuiasService } from '../../services/control-camiones-guias.service';




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
    public alertasService: AlertasService


  ) { }


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
  this.planificacionEntregasService.bultosTotales = 0
  this.planificacionEntregasService.clientesTotales = 0
  this.planificacionEntregasService.pesoTotal = 0
  this.planificacionEntregasService.fecha = null;
  this.controlCamionesGuiasService.listaCamionesGuia = []
  this.controlCamionesGuiasService.Fecha = null;
  this.controlCamionesGuiasService.listaCamionesGuia = []
  this.planificacionEntregasService.rutaFacturasArray = [];
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

    this.planificacionEntregasService.syncRutaFacturas( this.rutaZona.Ruta, this.fecha);
    
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
    
      this.rutaZona = null;
  
      this.rutaZona = valor
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
      this.controlCamionesGuiasService.Fecha = valor;
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

 this.controlCamionesGuiasService.generarPost()

this.rutaZona = null;

}


//=============================================================================
// SERVICIO COMPARTIDO EN VARIAS VITAS QUE MUESTRA LA LISTA DE CAMIONES Y DEVUELVE EL VALOR SELECCIONADO
//=============================================================================

async listaCamiones(){

  const modal = await this.modalCtrl.create({
    component: ListaCamionesModalPage,
    cssClass: 'large-modal'
  });

  modal.present();
      
        
  const { data } = await modal.onDidDismiss();

  if(data !== undefined){

//=============================================================================
// UNA VEZ QUE OBTENEMOS LA INFORMACION DEL CAMION PROCEDEMOS A AGREGAR TODAS
// LAS FACTURAS A UNA SOLA GUIA
//=============================================================================
 
 
this.controlCamionesGuiasService.agregarTodasFacturasUnicoCamion(this.rutaZona.Ruta, data.camion,  this.fecha);
      
  }
  
}

//=============================================================================
// REMUEVE UNA FACTURA  LA CUAL SE FILTRA POR MEDIO DEL PARAMETRO CONSECUTIVO 
//QUE SERIA EL IDENTIFICADOR DE CADA GUIA DONDE GUARDAMOS LAS FACTURAS
//=============================================================================

removerGuia(consecutivo){

  this.controlCamionesGuiasService.removerGuia(consecutivo)

}

//=============================================================================
// MUESTRA UN MODAL CON TODOS LOS CLIENTES DENTRO DE UNA GUIA
//=============================================================================
mostrarDetalleGuia(consecutivo){

  this.controlCamionesGuiasService.mostrarDetalleGuia(consecutivo, this.rutaZona, this.fecha)

}

//=============================================================================
// NOS PERMITE GENERAR UNA NUEVA GUIA POR MEDIO DE UNA FACTURA
//=============================================================================

agregarGuia(factura){

  this.controlCamionesGuiasService.agregarGuia(factura);

}
 

}
