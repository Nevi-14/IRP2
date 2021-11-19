import { AfterViewInit, Component, ElementRef, Input, ViewChild, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import * as  mapboxgl from 'mapbox-gl';
import { MarcadoresService } from 'src/app/services/componentes/mapas/marcadores.service';
import { DetalleClientesPage } from '../../../../pages/detalle-clientes/detalle-clientes.page';
import { ClienteFacturaPage } from '../../../../pages/cliente-factura/cliente-factura.page';

interface Marcadores{
  id:string,
  funcion: string,
  cliente:any,
  color: string,
  nombre: string,
  marker?: mapboxgl.Marker,
  centro?:[number,number]
}

interface objectoArreglo{
nombre:string,
funcion: string,
id:string,
arreglo:any
}


@Component({
  selector: 'app-marcadores',
  templateUrl: './marcadores.component.html',
  styles: [
    `
  
    .mapa-container {
      height:100%;
     width:100%;
  
    }

    ion-list{
      position: fixed;
      top: 0px;
      right: 0px;
      z-index: 99999;
      height:100%;
      width:180px;
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
  zoomLevel: number =12;
  center: [number,number] = [ -84.12216755918627, 10.003022709670836 ];
  // Arreglo de marcadores
  @Input() markers:any;
  @Input() nombre:any;
  @Input() id:any;
  @Input() menu:boolean;
  constructor(private modalCtrl:ModalController, private marcadoresService: MarcadoresService) { }

  
ngOnInit(){
  this.leerMarcador(this.markers);
}
  ngAfterViewInit(): void {
   console.log(this.markers,'markers')
    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11?optimize=true',
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
     
if(this.marcadores){
  this.marcadores.forEach(item=>{
    const newMarker= new mapboxgl.Marker({
      color:item.color,
      draggable: false
  
    })


    const miniPopup = new  mapboxgl.Popup();
    const nombre = item.nombre;
    miniPopup.setText(  item.id + ' ' + nombre )
    newMarker.setPopup(miniPopup);
    newMarker.setLngLat([item.cliente.LONGITUD,item.cliente.LATITUD]!)
    
    .addTo(this.mapa);
    this.mapa.on('load', () => {
      this.mapa.resize();
    });

  })
}


   



  }

  async detalleClientes(cliente){
    console.log(cliente)
    const modal = await this.modalCtrl.create({
      component: DetalleClientesPage,
      cssClass: 'modal-detalle',
      componentProps:{
        detalleCliente: cliente
      }
    });
    return await modal.present();
  }

  async mostrarClienteFactura(cliente) {
    //  alert(cliente.NOMBRE)
       const modal = await this.modalCtrl.create({
         component: ClienteFacturaPage,
         cssClass: 'modal-detalle',
         componentProps: {
           cliente: cliente
         }
       });
       return await modal.present();
     }

  leerMarcador(arreglo:objectoArreglo[]){
console.log(arreglo,'dhdhdh')
    this.marcadores = [];

    const defaultMarker = new mapboxgl.Marker()
    const miniPopupDe = new  mapboxgl.Popup();
    miniPopupDe.setText('ISLEÑA')
    defaultMarker.setPopup(miniPopupDe);
   
    defaultMarker.setLngLat(this.center)

    this.marcadores.push({
      id:'ISLEÑA',
      funcion:'',
      cliente:'ISLEÑA',
      nombre:'ISLEÑA',
      marker:defaultMarker,
      color:'#DDD'
    })
if(arreglo){
  for(let i =0; i < arreglo.length ;i++)
  {
      
    for(let index = 0 ; index < arreglo[i].arreglo.length; index ++){
      const color = "#xxxxxx".replace(/x/g, y=>(Math.random()*16|0).toString(16));
      const newMarker= new mapboxgl.Marker({
        color:color,
        draggable: false 
      })
      newMarker.setLngLat([arreglo[i].arreglo[index].LONGITUD,arreglo[i].arreglo[index].LATITUD]!)
      this.marcadores.push({
        id:arreglo[i].arreglo[index][arreglo[i].id],
        funcion:arreglo[i].funcion,
        cliente:arreglo[i].arreglo[index],
        nombre:arreglo[i].arreglo[index][arreglo[i].nombre],
        marker:newMarker,
        color:color
      })
    }
    console.log(this.marcadores)
  
  
  } 
} 
  }


  irMarcador(marker: mapboxgl.Marker){
    this.mapa.flyTo(
      {center: marker.getLngLat(),zoom:18}
      )
    }


enrutador(expression, id){
  switch(expression) {
    case 'detalleClientes':
      this.detalleClientes(id);
      break;
    case 'mostrarClienteFactura':
      // code block

      this.mostrarClienteFactura(id);
      break;
    default:
      // code block
  }
}
  
    borrarMarcador(i:number){
  this.marcadores[i].marker?.remove();
  this.marcadores.splice(i, 1);

    }
  

cerrarModal(){
this.modalCtrl.dismiss();
}
 
}
