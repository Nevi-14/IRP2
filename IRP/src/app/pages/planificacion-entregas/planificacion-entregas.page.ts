import { Component } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { ZonasService } from 'src/app/services/zonas.service';
import { RutasService } from 'src/app/services/rutas.service';
import { RutaFacturasService } from 'src/app/services/ruta-facturas.service';
import { RutaZonaService } from 'src/app/services/ruta-zona.service';
import { ServiciosCompartidosService } from 'src/app/services/servicios-compartidos.service';
import { ControlCamionesGuiasService } from 'src/app/services/control-camiones-guias.service';
import { PlanificacionEntregasService } from 'src/app/services/planificacion-entregas.service';
import { AlertasService } from 'src/app/services/alertas.service';
import { RutaMapaComponent } from '../../components/ruta-mapa/ruta-mapa.component';
import { ControlFacturasPage } from '../control-facturas/control-facturas.page';
import { DatatableService } from 'src/app/services/datatable.service';


@Component({
  selector: 'app-planificacion-entregas',
  templateUrl: './planificacion-entregas.page.html',
  styleUrls: ['./planificacion-entregas.page.scss'],
})
export class PlanificacionEntregasPage  {


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
  pesoTotal = 0;
  totalBultos = 0;

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

this.pesoTotal = 0;
this.totalBultos = 0;
this.rutaZona = null;
this.datableService.dataTableArray = [];
this.controlCamionesGuiasService.listaGuias = [];
this.datableService.page = 0;
this.datableService.dataTableArray[this.datableService.page]

 }

 clearDatableArray(){

this.datableService.dataTableArray.forEach(cliente =>{

    for(let i =0; i < cliente.length; i++){

      for( let j = 0; j < cliente[i].length; j++){

     let factura = cliente[i][j];

     factura.idGuia = '';

      }
  
    };
  
  });
 }




 ionViewWillEnter(){

  this.limpiarDatos();
}


 


//=============================================================================
// SINCRONIZA LAS RUTAS Y FACTURAS BASADO EN LA RUTA Y FECHA
//=============================================================================

async exportarGuias() {
  this.controlCamionesGuiasService.exportarGuias();

  
}
  cargarDatos(){

  this.planificacionEntregasService.syncRutaFacturas( this.controlCamionesGuiasService.rutaZona.Ruta, this.fecha).then(resp =>{

    if(resp.length == 0){

      this.alertasService.message('IRP', 'No hay datos que mostrar   fecha : ' + this.fecha);
    }

       for(let i =0; i  < resp.length; i++){

       this.pesoTotal += resp[i].TOTAL_PESO;
       this.totalBultos +=  Number(resp[i].RUBRO1);


      }
  

  this.datableService.totalElements = resp.length;
  this.datableService.agruparElementos(resp, 'CLIENTE',[ {name:'idGuia',default:false},{name:'factura',default:true}]).then(array =>{

  this.datableService.totalGroupElements = array.length;

    
  this.datableService.generarDataTable(array, 10).then(resp =>{
       
  this.datableService.totalPages = resp.length;

  this.datableService.dataTableArray = resp;

      
       }) 
 

    })
;


    });

 
    
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

this.serviciosCompartidosService.calendarioModal('/').then(valor =>{

    if(valor !== undefined){
      this.limpiarDatos();
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
