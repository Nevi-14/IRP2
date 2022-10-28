import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { GuiaEntrega } from 'src/app/models/guiaEntrega';
import { PlanificacionEntregas } from 'src/app/models/planificacionEntregas';
import { AlertasService } from 'src/app/services/alertas.service';
import { ControlCamionesGuiasService } from 'src/app/services/control-camiones-guias.service';
import { GestionCamionesService } from 'src/app/services/gestion-camiones.service';
import { GuiasService } from 'src/app/services/guias.service';
import { RuteroService } from 'src/app/services/rutero.service';
interface cliente {
  id: number,
  idGuia:string,
  cliente: string,
  latitud: number,
  longitud:number,
  distancia: number,
  duracion:number,
  direccion:string,
  bultosTotales:number,
  orden_visita: number,
  HoraInicio:Date,
  HoraFin:Date
}

 

//=============================================================================
// INTERFACE DE  MODELO GUIA DE ENTREGA
//=============================================================================

interface  Guias{

  idGuia: string,
  verificada:boolean,
  guiaExistente:boolean,
  zona: string,
  ruta: string,
  fecha: string,
  numClientes: number,
  totalFacturas:number
  distancia: number,
  duracion:number
  camion:{
    HoraInicio:string,
    HoraFin:string,
    chofer:string,  
    idCamion: string,
    capacidad: number,
    pesoRestante: number,
    peso: number,
    estado: string,
    HH: string,
    volumen: number,
    frio:string,
    seco:string
  }
  clientes:cliente[],
  facturas: PlanificacionEntregas[]
}
interface clientes {
  id: number,
  nombre: string,
  facturas: PlanificacionEntregas[]
}
@Component({
  selector: 'app-control-facturas',
  templateUrl: './control-facturas.page.html',
  styleUrls: ['./control-facturas.page.scss'],
})
export class ControlFacturasPage implements OnInit {
  @Input() factura:PlanificacionEntregas
  @Input() facturas:clientes[]
  facturasOriginal:clientes[] = [];
  facturasArray:any[] = [];
  guias:Guias[]=[];
 titulo = null;
  listaGuias:boolean = true;
  listaOtrasGuias:boolean = false;
  listaGuiasExistentes:boolean = false;
  incluirFacturas:boolean = false;

  guiaEnRuta:GuiaEntrega;
  camiones  = [];
  verdadero = true;
  falso = false;
  textoBuscar = '';

  constructor(
    public alertCTrl: AlertController,
    public controlCamionesGuiasService: ControlCamionesGuiasService,
    public guiasService: GuiasService,
    public gestionCamiones: GestionCamionesService,
    public modalCtrl: ModalController,
    public ruteroService: RuteroService,
    public alertasService: AlertasService,
    public gestionCamionesService: GestionCamionesService
  ) { }

  ngOnInit() {
 this.titulo = this.factura.NOMBRE_CLIENTE;

 console.log(this.facturas, 'facturas')
    if(this.controlCamionesGuiasService.listaGuias.length > 0 ){
      this.listaGuiasExistentes = true
      this.listaGuias = false;
      this.listaOtrasGuias = false;

this.guiasExistentes();

    }else{
      this.listaGuias = true;
      this.listaGuiasExistentes = false
      this.listaOtrasGuias = false;
      this.guiasNuevas();
    }
  }

  async filtrar() {


    if(this.facturas.length > this.facturasOriginal.length){
      this.facturasOriginal = this.facturas;

    }
    

    let inputs = [];


    for (let c = 0; c < this.facturas.length; c++) {

      inputs.push({
        label: this.facturas[c].nombre,
        type: 'radio',
        value: {
          id:this.facturas[c].id,
          nombre:this.facturas[c].nombre
        },
      })
      if (c == this.facturas.length - 1) {
 inputs.push({
        label: 'Todos los clientes',
        type: 'radio',
        value: 'all',
      })
      inputs.push({
        label: 'Remover Filtro',
        type: 'radio',
        value: null,
      })
      inputs.sort((a, b) => +(a.label > b.label) || -(a.label < b.label))
        const alert = await this.alertCTrl.create({
          header: 'SDE RP CLIENTES',
          cssClass: 'my-custom-alert',
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              handler: () => {

 this.incluirFacturas = false;

              },
            },
            {
              text: 'OK',
              role: 'confirm',
              handler: (data) => {
         
                this.facturasArray = []
                if(data == null){
                  this.titulo = this.factura.NOMBRE_CLIENTE;
                  this.incluirFacturas = false;
                  this.facturas = this.facturasOriginal;
                  return;
                }

                if(data == 'all'){
                  this.titulo = 'Todas las Facturas';
                  this.incluirFacturas = true;
                  this.facturas = this.facturasOriginal;
                  this.agregarTodasFacturas();  

            
                  return;
                }
                this.titulo = data.nombre;
                this.incluirFacturas = true;
this.facturas = this.facturasOriginal.filter(x => x.id === data.id);
this.agregarTodasFacturas();     
              },
            },
          ],
          inputs: inputs
        });

        await alert.present();
      }
    }

  }

  onSearchChange(event){
    this.textoBuscar = event.detail.value;
    
   }

  agregarTodasFacturas(){


    console.log(' this.facturas', this.facturas)
    this.facturas.forEach(cliente => {
      console.log('cliente', cliente)
      cliente.facturas.forEach(factura => {

        console.log('factura', factura)
      this.facturasArray.push(factura)

    });
 
      
    });
  }


  async retornarCamion(camion:any){


   let id = this.controlCamionesGuiasService.generarIDGuia();

   if(this.factura.ID_GUIA){
    this.controlCamionesGuiasService.borrarFacturaGuia(this.factura)

   }

 if(this.listaGuias){

  camion.idGuia =id;
  camion.camion.numeroGuia =id;
  this.controlCamionesGuiasService.listaGuias.push(camion);

  if(this.incluirFacturas){

    this.facturasArray.forEach( factura =>{
    
    
      this.controlCamionesGuiasService.agregarFacturaGuiaNueva(camion.idGuia, factura);
    })

    this.cerrarModal();
    return
    }



  this.controlCamionesGuiasService.agregarFacturaGuiaNueva(id, this.factura);

  this.cerrarModal();
  return
 }

 if(this.incluirFacturas){

  this.facturasArray.forEach( factura =>{
  

    this.controlCamionesGuiasService.agregarFacturaGuiaNueva(camion.idGuia, factura);
  })
  this.cerrarModal();
return
  } 
  this.controlCamionesGuiasService.agregarFacturaGuiaNueva(camion.idGuia, this.factura);
  this.cerrarModal();
    console.log('listaGuias',this.controlCamionesGuiasService.listaGuias)
  
  }

  cerrarModal(){
    this.modalCtrl.dismiss();
  }

  toggleGuiasNuevas($event){
    if($event.detail.checked){
      this.listaGuias = true;
      this.listaGuiasExistentes = false
     this.listaOtrasGuias = false;
      this.guiasNuevas();
    }
  }
  toggleGuiasExistentes($event){ 


    if($event.detail.checked){
     this.listaGuias = false;
     this.listaOtrasGuias = false;
     this.listaGuiasExistentes = true
    this.guiasExistentes();
    }
  }
  toggleOtrasGuias($event){

    if($event.detail.checked){
      this.listaGuias = false;
      this.listaGuiasExistentes = false
     this.listaOtrasGuias = true;
       this.otrasGuias();
    }  
    
    
      }


      guiasNuevas(){
        this.gestionCamionesService.syncCamionesToPromise().then(camiones =>{
      
          this.controlCamionesGuiasService.generarPreListaGuias(camiones).then(lista =>{
    
            this.guias = lista;
            console.log('lista nueva', lista)
          })
    
        });

      }

      guiasExistentes(){
        this.guias = this.controlCamionesGuiasService.listaGuias;
        console.log('guias existentes', this.controlCamionesGuiasService.listaGuias)
      }

      otrasGuias(){
        this.guiasService.syncGuiasEnRutaPromise('INI').then(camiones =>{

          console.log('guiasEnruta', camiones)
          this.gestionCamionesService.syncCamionesToPromise().then(resp =>{
            this.gestionCamionesService.camiones = resp;
            this.controlCamionesGuiasService.generarListaGuiasEstadoINIT(camiones).then(lista =>{
              this.guias = lista;
              console.log('lista otras', lista)
            })
          })

        
      
                  })

      }
}
