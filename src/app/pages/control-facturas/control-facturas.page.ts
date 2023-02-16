import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { ClientesGuia, Guias } from 'src/app/models/guia';
import { AlertasService } from 'src/app/services/alertas.service';
import { GestionCamionesService } from 'src/app/services/gestion-camiones.service';
import { PlanificacionEntregasService } from 'src/app/services/planificacion-entregas.service';
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
    public planificacionEntregasService: PlanificacionEntregasService
  ) { }

  ngOnInit() {

    if(this.planificacionEntregasService.listaGuias.length > 0){
      this.nuevaGuia = false;
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
    this.guiaExistente = !next;
    if(next){
      this.guiasNuevas();
    }else{
      this.guias = this.planificacionEntregasService.listaGuias
    }
  }

toggleGuiasExistentes($event){
  let next  = $event.detail.checked;
  this.nuevaGuia = !next;
  if(next){
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


async retornarCamion(camion:any){

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
      if(factura.LONGITUD && factura.LATITUD){
          this.planificacionEntregasService.agregarFacturaGuiaNueva(camion.idGuia, factura);    
      }  
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
