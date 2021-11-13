import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import * as  mapboxgl from 'mapbox-gl';
import { DetalleClientesPage } from 'src/app/pages/detalle-clientes/detalle-clientes.page copy';
import { MarcadoresService } from 'src/app/services/componentes/mapas/marcadores.service';



@Component({
  selector: 'app-marcadores',
  templateUrl: './marcadores.component.html',
  styles: [
    `
  
    .mapa-container {
      height:100vh;
     width:100vw;
  
    }

    ion-list{
      position: fixed;
      top: 10px;
      right: 30px;
      z-index: 99999;
      max-height:300px;
      max-width:200px;
      overflow: hidden;
      overflow-y: auto;
      ::-webkit-scrollbar {
        display: none;
      }
    }
    `
  ]
})
export class MarcadoresComponent implements AfterViewInit {
  @ViewChild('mapa') divMapa!: ElementRef;
  mapa!: mapboxgl.Map;
  zoomLevel: number = 10;
  center: [number,number] = [ -84.12216755918627, 10.003022709670836 ];
  // Arreglo de marcadores
  @Input() markers:any;
  @Input() nombre:any;
  @Input() id:any;
  constructor(private modalCtrl:ModalController, private marcadoresService: MarcadoresService) { }

  ngAfterViewInit(): void {
    this.marcadoresService.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom: this.zoomLevel
      });

     const  newMarker = new mapboxgl.Marker()

 const miniPopup = new  mapboxgl.Popup();
 miniPopup.setText('ISLEÑA')
 newMarker.setPopup(miniPopup);

 newMarker.setLngLat(this.center)
.addTo(this.marcadoresService.mapa)
.togglePopup();

this.marcadoresService.mapa.on('load', () => {
  this.marcadoresService.mapa.resize();
});
this.marcadoresService.leerMarcador(this.markers,this.nombre, this.id);

  }

  async detalleClientes(cliente){
    const modal = await this.modalCtrl.create({
      component: DetalleClientesPage,
      cssClass: 'modal-md',
      componentProps:{
        detalleCliente: cliente
      }
    });
    return await modal.present();
  }

cerrarModal(){
this.modalCtrl.dismiss();
}
 
}
