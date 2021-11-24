import { AfterViewInit, Component, ElementRef, Input, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import * as  mapboxgl from 'mapbox-gl';
import { MarcadoresService } from 'src/app/services/componentes/mapas/marcadores.service';
import { DetalleClientesPage } from '../../pages/detalle-clientes/detalle-clientes.page';
import { ClienteFacturaPage } from '../../pages/cliente-factura/cliente-factura.page';
import { RutasPage } from 'src/app/pages/rutas/rutas.page';
import { MarcadoresPage } from 'src/app/pages/marcadores/marcadores.page';
import { ConfiguracionMapaPage } from 'src/app/pages/configuracion-mapa/configuracion-mapa.page';
import { RutaZonaService } from 'src/app/services/paginas/rutas/ruta-zona.service';
import { ZonasService } from 'src/app/services/paginas/organizacion territorial/zonas.service';
import { RutasService } from 'src/app/services/paginas/rutas/rutas.service';
import { ClienteEspejoService } from 'src/app/services/paginas/clientes/cliente-espejo.service';
import { ClientesService } from 'src/app/services/paginas/clientes/clientes.service';
import { RutaFacturasService } from '../../services/paginas/rutas/ruta-facturas.service';
import { MapaService } from 'src/app/services/componentes/mapas/mapa.service';
import { MenuClientesPage } from 'src/app/pages/menu-clientes/menu-clientes.page';


@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styles: [
    `
  
    .mapa-container {
      height:100%;
     width:100%;
  
    }

    
    ion-list{
      position: fixed;
      top: 90px;
      right: 0px;
      z-index: 99999;
      height:85%;
      width:220px;
      overflow: hidden;
      overflow-y: auto;
      ::-webkit-scrollbar {
        display: none;
      }
    }
    `
  ]
})
export class MapaComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild('mapa') divMapa!: ElementRef;
  mapa!: mapboxgl.Map;

  zoomLevel: number =12;
  center: [number,number] = [ -84.12216755918627, 10.003022709670836 ];
  // Arreglo de marcadores
  @Input() marcadores:any;
  @Input() titulo:any;
  @Input() funcion: string;
   rutaZonaData= { rutaID: '', ruta: '', zonaId:'', zona:'' }
  constructor(private modalCtrl:ModalController, private marcadoresService: MarcadoresService, private popOverCrtl:PopoverController, private rutaZona: RutaZonaService, private zonas: ZonasService, private rutas: RutasService, private clienteEspejo: ClienteEspejoService, private clientes: ClientesService, private rutasFacturas: RutaFacturasService, private map: MapaService) { }

  ngOnDestroy(){
  
    this.map.reset(this.divMapa);
    
  }
ngOnInit(){

}
  ngAfterViewInit(): void {
  this.map.crearMapa(this.divMapa, this.marcadores);

  }



cerrarModal(){
this.modalCtrl.dismiss();
}



async configuracionZonaRuta(evento) {

  const popover = await this.popOverCrtl.create({
    component: RutasPage,
    cssClass: 'menu-map-popOver',
    event: evento,
    translucent: true,
    mode:'ios',
   backdropDismiss:false
  });

   popover.present();


  const { data } = await popover.onDidDismiss();
  
  if(data.ruta != ''){

  
    const i = this.rutaZona.rutasZonasArray.findIndex( r => r.Ruta === data.ruta );
    
   
    if ( i >= 0 ){
      const  z = this.zonas.zonas.findIndex( z => z.ZONA === this.rutaZona.rutasZonasArray[i].Zona);
         this.rutaZonaData.rutaID = this.rutaZona.rutasZonasArray[i].Ruta;
         this.rutaZonaData.ruta =this.rutaZona.rutasZonasArray[i].Descripcion;
         this.rutaZonaData.zonaId =  this.zonas.zonas[z].ZONA;
         this.rutaZonaData.zona = this.zonas.zonas[z].NOMBRE;
      
       }  

    
    this.syncRutas(this.funcion)

    //this.map.leerMarcador([{nombre:'NOMBRE',id:'IdCliente',arreglo:this.clientes.rutasClientes},{nombre:'NOMBRE',id:'IdCliente',arreglo:this.clientes.nuevosClientes}]);
  }

}

async informacionMarcadores(evento) {

  const modal = await this.modalCtrl.create({
    component: MarcadoresPage,
    cssClass: 'medium-modal',
    componentProps:{
      marcadores: this.map.marcadores,
      funcion: this.funcion
    }
   // backdropDismiss:false
  });
  
  await modal.present();

}




  async syncRutas(expression){

 switch(expression){
    case 'planificacion-rutas':

       this.clienteEspejo.syncRutas( this.rutaZonaData.rutaID);
    
      break;
    case 'rutas-facturas':
    //  this.clienteEspejo.syncRutas('',this.rutaZonaData.rutaID, this.marcadores);
      this.rutasFacturas.syncRutaFacturas( this.rutaZonaData.rutaID, new Date());
      break;
    default:
      // code block
  }
  const result = await this.waitSecondFunction(2);

}


 waitSecondFunction(seconds:number) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('resolved');
      this.map.crearMapa(this.divMapa,this.marcadores);
    }, seconds*1000);
  });
}

async menuCliente(){

  const modal = await this.modalCtrl.create({
    component: MenuClientesPage,
    cssClass: 'right-modal',
    componentProps:{
      mapa:  this.divMapa
    }
  });
   await modal.present();

   const { data } = await modal.onDidDismiss();
   
   if(data.statement === true){

    this.map.leerMarcador([{nombre:'NOMBRE',id:'IdCliente',arreglo:this.clientes.rutasClientes},{nombre:'NOMBRE',id:'IdCliente',arreglo:this.clientes.nuevosClientes}]);
  
   }
       
      }
    





}

