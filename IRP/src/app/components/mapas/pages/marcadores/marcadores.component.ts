import { AfterViewInit, Component, ElementRef, Input, ViewChild, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import * as  mapboxgl from 'mapbox-gl';
import { MarcadoresService } from 'src/app/services/componentes/mapas/marcadores.service';
import { DetalleClientesPage } from '../../../../pages/detalle-clientes/detalle-clientes.page';

interface Marcadores{
  id:string,
  cliente:any,
  color: string,
  nombre: string,
  marker?: mapboxgl.Marker,
  centro?:[number,number]
}


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
      max-height:600px;
      max-width:400px;
      overflow: hidden;
      overflow-y: auto;
      ::-webkit-scrollbar {
        display: none;
      }
    }
    `
  ]
})
export class MarcadoresComponent implements AfterViewInit, OnInit {
  @ViewChild('mapa') divMapa!: ElementRef;
  mapa!: mapboxgl.Map;
  marcadores: Marcadores[]=[];
  zoomLevel: number = 10;
  center: [number,number] = [ -84.12216755918627, 10.003022709670836 ];
  // Arreglo de marcadores
  @Input() markers:any;
  @Input() nombre:any;
  @Input() id:any;
  constructor(private modalCtrl:ModalController, private marcadoresService: MarcadoresService) { }

  
ngOnInit(){
  this.leerMarcador(this.markers,this.nombre, this.id);
}
  ngAfterViewInit(): void {
   console.log(this.markers,'markers')
    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom: this.zoomLevel
      });

      const defaultMarker = new mapboxgl.Marker()
      const miniPopupDe = new  mapboxgl.Popup();
      miniPopupDe.setText('ISLEÑA')
      defaultMarker.setPopup(miniPopupDe);
     
      defaultMarker.setLngLat(this.center)
     .addTo(this.mapa)
     .togglePopup();
     
this.marcadores.forEach(item=>{
  const newMarker= new mapboxgl.Marker({
    color:item.color,
    draggable: false

  })
  console.log(item)
  const miniPopup = new  mapboxgl.Popup();
  const nombre = item.nombre;
  miniPopup.setText(nombre)
  newMarker.setPopup(miniPopup);
  newMarker.setLngLat([item.cliente.LONGITUD,item.cliente.LATITUD]!)
  .addTo(this.mapa);
})

this.mapa.on('load', () => {
  this.mapa.resize();
});


  }

  async detalleClientes(cliente){
    console.log(cliente)
    const modal = await this.modalCtrl.create({
      component: DetalleClientesPage,
      cssClass: 'modal-md',
      componentProps:{
        detalleCliente: cliente
      }
    });
    return await modal.present();
  }

  leerMarcador(arreglo:any[], columna:string, id:string){
    this.marcadores = [];
    for(let i =0; i < arreglo.length ;i++)
  {
    const color = "#xxxxxx".replace(/x/g, y=>(Math.random()*16|0).toString(16));
    const newMarker= new mapboxgl.Marker({
      color:color,
      draggable: false
  
    })
    newMarker.setLngLat([arreglo[i].LONGITUD,arreglo[i].LATITUD]!)
    this.marcadores.push({
      id:arreglo[i][id],
      cliente:arreglo[i],
      nombre:arreglo[i][columna],
      marker:newMarker,
      color:color
    })
  
  
  }  
  }


  irMarcador(marker: mapboxgl.Marker){
    this.mapa.flyTo(
      {center: marker.getLngLat(),zoom:18}
      )
    }



  
    borrarMarcador(i:number){
  this.marcadores[i].marker?.remove();
  this.marcadores.splice(i, 1);

    }
  

cerrarModal(){
this.modalCtrl.dismiss();
}
 
}
