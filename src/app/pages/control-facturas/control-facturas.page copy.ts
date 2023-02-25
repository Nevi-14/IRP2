import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { ClientesGuia, Guias } from 'src/app/models/guia';
import { GuiaEntrega } from 'src/app/models/guiaEntrega';
import { AlertasService } from 'src/app/services/alertas.service';
import { ConfiguracionesService } from 'src/app/services/configuraciones.service';
import { FacturasService } from 'src/app/services/facturas.service';
import { GestionCamionesService } from 'src/app/services/gestion-camiones.service';
import { PlanificacionEntregasService } from 'src/app/services/planificacion-entregas.service';
import { RutasZonasService } from 'src/app/services/rutas-zonas.service';
import { RuteroService } from 'src/app/services/rutero.service';
import { FacturasNoAgregadasPage } from '../facturas-no-agregadas/facturas-no-agregadas.page';

@Component({
  selector: 'app-control-facturas',
  templateUrl: './control-facturas.page.html',
  styleUrls: ['./control-facturas.page.scss'],
})
export class ControlFacturasPage implements OnInit {
  @Input() facturas:ClientesGuia[] = []
  facturasAnteriores:ClientesGuia[] = []
  guias:Guias[]=[];
  guiasAnteriores:Guias[]=[];
  nuevaGuia:boolean = true;
  guiaExistente:boolean = false;
  guiaIni:boolean = false;
  incluirFacturas:boolean = false;
  totalFacturas:number=0;
  pesoTotal:number=0;
  bultosTotales:number=0;
  totalFrio:number=0;
  totalSeco:number=0;
  textoBuscar = '';
  sliderOpts = {
    initialSlide: 0,
    zoom: false,
    slidesPerView: 2,
    spaceBetween: 10,
    centeredSlides: false,
    autoplay:false,
    speed: 500,
    // Responsive breakpoints
  breakpoints: {
    // when window width is >= 320px
    320: {
      slidesPerView: 1,
      spaceBetween: 20
    },
    // when window width is >= 640px
    940: {
      slidesPerView: 2,
      spaceBetween: 40
    }
  },
  };
  constructor(
    public alertCTrl: AlertController,
    public gestionCamiones: GestionCamionesService,
    public modalCtrl: ModalController,
    public ruteroService: RuteroService,
    public alertasService: AlertasService,
    public gestionCamionesService: GestionCamionesService,
    public planificacionEntregasService: PlanificacionEntregasService,
    public configuracionesService: ConfiguracionesService,
    public facturasService: FacturasService,
    public cdr: ChangeDetectorRef,
    public rutaZonaService: RutasZonasService
  ) { }

  ngOnInit() {

    if(this.planificacionEntregasService.listaGuias.length > 0){
      this.nuevaGuia = false;
      this.guiaIni  = false;
      this.guiaExistente = true;
      this.guias = this.planificacionEntregasService.listaGuias
    }else{
      this.guiasNuevas();
    }
this.calcularTotales();
  }

  onSearchChange(event){
    this.textoBuscar = event.detail.value;
    
   }


  toggleGuiasNuevas($event){
    let next  = $event.detail.checked;

    if(next){
      this.nuevaGuia = true;
      this.guiaIni = false;
      this.guiaExistente = false;
      this.guiasNuevas();
    }else{
      this.guias = this.planificacionEntregasService.listaGuias
    }
  }

  toggleGuiasEstadoIni($event){
    let next  = $event.detail.checked;
    let fecha = this.planificacionEntregasService.fecha; 

    if(next){
      this.guiaIni = true;
      this.nuevaGuia = false;
      this.guiaExistente = false;
     this.alertasService.presentaLoading('Cargandod datos...')
      this.planificacionEntregasService.getGuiaEstadoRangoFechaToPromise('INI',new Date(fecha).toISOString(),new Date(fecha).toISOString()).then(guias =>{
 
    console.log('guias', guias)

   this.guiasExistentes(guias)
    

      }, error =>{
        this.alertasService.loadingDissmiss();
        this.alertasService.message('IRP','Lo sentimos algo salio mal');
      })
    }else{
      this.guiasNuevas();
    }

  }

  async guiasExistentes(guias:GuiaEntrega[]){
    this.guias = [];
  const camiones = await  this.gestionCamiones.syncCamionesToPromise();  
  const rutas = await this.rutaZonaService.syncRutasToPromise();
  for(let i =0; i < guias.length ; i++ ){
 
    let c = camiones.findIndex(camion => camion.idCamion == guias[i].idCamion);
    let r = rutas.findIndex(ruta => ruta.RUTA == guias[i].ruta);
    if(c >=0){


      let capacidad = camiones[c].capacidadPeso;
      let id =  guias[i].idGuia;
      let guia: Guias = {
        idGuia: id,
        guiaExistente: true,
        verificada: false,
        totalFacturas: 0,
        distancia: 0,
        duracion: 0,
        zona: guias[i].zona,
        nombreRuta: r >=0 ? rutas[r].DESCRIPCION : 'Sin definir',
        ruta: guias[i].ruta,
        fecha:guias[i].fecha,
        numClientes: guias[i].numClientes,
        camion: {
          numeroGuia: id,
          chofer: camiones[c].chofer,
          idCamion: camiones[c].idCamion,
          capacidad: capacidad,
          pesoRestante: capacidad,
          peso: guias[i].peso,
          estado: guias[i].estado,
          HH: 'nd',
          bultos: 0,
          volumen: camiones[c].capacidadVolumen,
          frio: camiones[c].frio,
          seco: camiones[c].seco,
          HoraInicio: '08:00',
          HoraFin: '20:00'
    
        },
        clientes: [],
        facturas: []
      }
  
  
   this.guias.push(guia)
    
    }


  



    if(i == guias.length -1){
      this.alertasService.loadingDissmiss();
    }
  }
  }
toggleGuiasExistentes($event){
  let next  = $event.detail.checked;

  if(next){
    this.guiaExistente = true;
    this.guiaIni = false;
    this.nuevaGuia = false;
    this.guias = this.planificacionEntregasService.listaGuias
  }else{
    this.guiasNuevas();
  }
}

calcularTotales(){
  this.totalFacturas = 0;
  this.pesoTotal  = 0;
  this.bultosTotales = 0;
  this.totalFrio  = 0;
  this.totalSeco = 0;
  this.facturas.forEach(factura =>{
  this.totalFacturas += factura.facturas.length;
  this.pesoTotal += factura.totalPeso;
  this.bultosTotales +=  factura.totalBultos;
  this.totalFrio +=   factura.totalFrio;
  this.totalSeco +=   factura.totalSeco;
  })
}



agregarTodasFacturas($event){
 let next  = $event.detail.checked;
 if(next){
  this.facturasAnteriores = this.facturas
this.facturas = this.planificacionEntregasService.clientes;
 }else{
  this.facturas = this.facturasAnteriores
  this.facturasAnteriores = []
 } 
 this.calcularTotales();
  
  }

  guiasNuevas(){
    this.gestionCamionesService.syncCamionesToPromise().then(camiones =>{
      this.planificacionEntregasService.generarPreListaGuias(camiones).then(lista =>{
        this.guias = lista;
        console.log('lista guias', lista)
      })

    });   
}
cerrarModal() {
  this.modalCtrl.dismiss();
}


async retornarCamion(camion: Guias){
console.log('camion', camion)

  if(camion.guiaExistente){
    console.log('guiaExistente', camion)
    this.planificacionEntregasService.listaGuias.push(camion);
    this.facturasService.syncGetFacturasGuiasToPromise(camion.idGuia).then(facturas =>{
      
      console.log('facturas', facturas)

      for(let f = 0; f < facturas.length ; f++){

         this.facturasService.syncGetFacturaToPromise(facturas[f].FACTURA).then(factura =>{
         let cliente =  factura[0];
         
          this.planificacionEntregasService.agregarFacturaGuia(camion.idGuia, cliente);  

         });
        

        if(f == facturas.length -1){

        }
      }


    }, error =>{

this.alertasService.message('IRP','Lo sentimos algo salio mal');

    })
  }

 console.log('camion', camion)
this.planificacionEntregasService.facturasNoAgregadas = [];
let  id = this.planificacionEntregasService.generarIDGuia();
if(this.nuevaGuia){ 
 camion.idGuia = id;
  this.planificacionEntregasService.listaGuias.push(camion);
 
}
  for(let i =0; i< this.facturas.length; i++){
    this.facturas[i].facturas.forEach(factura  => {
     if(camion.idGuia != factura.ID_GUIA){
      this.planificacionEntregasService.borrarFacturaGuia(factura) 
     }
     this.planificacionEntregasService.agregarFacturaGuia(camion.idGuia, factura);    
    })

    if(i == this.facturas.length -1 ){
    this.modalCtrl.dismiss()
    this.planificacionEntregasService.actualizarTotales();

      if(this.planificacionEntregasService.facturasNoAgregadas.length >0){
        this.facturasNoAgregadas()
      }
    }
  }  
 this.planificacionEntregasService.actualizarTotales();
this.cerrarModal();
}




async facturasNoAgregadas(){
  const modal = await this.modalCtrl.create({
    component: FacturasNoAgregadasPage,
    cssClass: 'ui-modal',
    componentProps:{
      facturas:this.planificacionEntregasService.facturasNoAgregadas
    }
  });
  modal.present();   
}







}
