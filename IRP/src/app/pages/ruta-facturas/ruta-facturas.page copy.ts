import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { MapService } from '../../services/componentes/mapas/map.service';
import { RutasService } from '../../services/paginas/rutas/rutas.service';
import { ZonasService } from 'src/app/services/paginas/organizacion territorial/zonas.service';
import { RutaFacturasService } from 'src/app/services/paginas/rutas/ruta-facturas.service';

import { ClientesService } from '../../services/paginas/clientes/clientes.service';
import { FechaPage } from '../fecha/fecha.page';
import { RutaZonaService } from 'src/app/services/paginas/rutas/ruta-zona.service';
import { RutasPage } from '../rutas/rutas.page';
import { RutaFacturas } from 'src/app/models/rutaFacturas';
import * as  mapboxgl from 'mapbox-gl';
import { ListaClientesRutaFacturasPage } from '../lista-clientes-ruta-facturas/lista-clientes-ruta-facturas.page';
@Component({
  selector: 'app-ruta-facturas',
  templateUrl: './ruta-facturas.page.html',
  styleUrls: ['./ruta-facturas.page.scss'],
})
export class RutaFacturasPage implements OnInit {
  rutaZonaData= { rutaID: '', ruta: '', zonaId:'', zona:'' }
  
  @ViewChild('mapa') divMapa!:ElementRef;
factura:RutaFacturas;
  constructor(public modalCtrl: ModalController, public rutas:RutasService, public zonas:ZonasService, public rutaFacturas: RutaFacturasService , public clientes: ClientesService, public clienteEspejo: ClientesService, public popOverCrtl: PopoverController, public rutaZonas: RutaZonaService) {
    this.factura = null;

   }

  ngOnInit() {
    console.log('hshshs')
  this.factura = null;

  console.log('hello','this.factura', this.factura)
  }

  createmapa() {


    
    const mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center:[this.factura.LONGITUD, this.factura.LATITUD],
      zoom:14,
        interactive:false
      });


  // Create a default Marker and add it to the map.
const newMarker = new mapboxgl.Marker({  draggable: true})
.setLngLat([this.factura.LONGITUD, this.factura.LATITUD])
.addTo(mapa);




mapa.addControl(new mapboxgl.NavigationControl());
mapa.addControl(new mapboxgl.FullscreenControl());
mapa.addControl(new mapboxgl.GeolocateControl({
    positionOptions: {
        enableHighAccuracy: true
    },
    trackUserLocation: true
}));



      mapa.on('load', () => {
        mapa.resize();
      });
  
    
  }

  mostrarFactura(factura:RutaFacturas){
    this.factura = factura;
    
    this.createmapa()
    console.log(this.factura)
  }
  

  async syncRutas(){
        // POPOVER DE FECHA

        const popover = await this.popOverCrtl.create({
          component: FechaPage,
          cssClass: 'my-custom-class',
          translucent: true
        });
        popover.present();
      
        
      
        const { data } = await popover.onDidDismiss();
      console.log(data)
        if(data !== undefined){
        
         
           this.rutaFacturas.syncRutaFacturas( this.rutaZonaData.rutaID, data.data);

  
          
        }
  }

 

  async listaClientesRutaFacturas() {
    const modal = await this.modalCtrl.create({
      component: ListaClientesRutaFacturasPage,
      cssClass: 'my-custom-class',
      componentProps: {
        'clientes':  this.rutaFacturas.rutaFacturasArray,

      }
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
      console.log(data)
        if(data !== undefined){
        

          this.mostrarFactura(data.factura)
            this.modalCtrl.dismiss();
        }



  }



  async configuracionZonaRuta(evento) {

 

    const popover = await this.popOverCrtl.create({
      component: RutasPage,
      cssClass: 'menu-map-popOver',
      event: evento,
      translucent: true,
      mode:'ios'
    });
  
     popover.present();
  
  
    const { data } = await popover.onDidDismiss();
   const ruta = data.ruta;
    if(data!==undefined){

      const i = this.rutaZonas.rutasZonasArray.findIndex( r => r.Ruta === ruta );
        

     
      if ( i >= 0 ){
        const  z = this.zonas.zonas.findIndex( z => z.ZONA === this.rutaZonas.rutasZonasArray[i].Zona);
           this.rutaZonaData.rutaID = this.rutaZonas.rutasZonasArray[i].Ruta;
           this.rutaZonaData.ruta =this.rutaZonas.rutasZonasArray[i].Descripcion;
           this.rutaZonaData.zonaId =  this.zonas.zonas[z].ZONA;
           this.rutaZonaData.zona = this.zonas.zonas[z].NOMBRE;
        
         }  

         const modal = await this.modalCtrl.create({
          component: FechaPage,
          cssClass: 'custom-modal',
        });
        modal.present();
      
        
      
        const { data } = await modal.onDidDismiss();
      console.log(data)
        if(data !== undefined){
        
    
          //  this.clienteEspejo.syncRutas('',this.rutaZonaData.rutaID, this.marcadores);
            this.rutaFacturas.syncRutaFacturas( this.rutaZonaData.rutaID, data.data);
            console.log(this.rutaFacturas.rutaFacturasArray,'arreglo')

            setTimeout(() => {
              this.mostrarFactura(this.rutaFacturas.rutaFacturasArray[0])
            }, 2*1000);


           
            this.modalCtrl.dismiss();
        }else{
     
          this.rutaZonaData = {rutaID: '', ruta: '', zonaId:'', zona:''};
        
        }

    }
  
  }





}
