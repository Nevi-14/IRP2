import {  Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as  mapboxgl from 'mapbox-gl';
import { RutasPage } from '../rutas/rutas.page';
import { DetalleClientesPage } from '../detalle-clientes/detalle-clientes.page';
import { MenuClientesPage } from '../menu-clientes/menu-clientes.page';
import { AlertController, LoadingController, ModalController, PopoverController } from '@ionic/angular';
import { ConfiguracionRutaService } from '../../services/configuracionruta.service';
import { ZonasService } from '../../services/paginas/organizacion territorial/zonas.service';
import { RutasService } from 'src/app/services/paginas/rutas/rutas.service';
import { ClientesService } from '../../services/paginas/clientes/clientes.service';
import { ClienteEspejoService } from '../../services/paginas/clientes/cliente-espejo.service';
import { MapService } from '../../services/componentes/mapas/map.service';
import { GlobalService } from 'src/app/services/global.service';
import { ActivatedRoute } from '@angular/router';
import { MapaComponent } from 'src/app/components/mapa/mapa.component';
import { MapaService } from 'src/app/services/componentes/mapas/mapa.service';



@Component({
  selector: 'app-planificacion-rutas',
  templateUrl: './planificacion-rutas.page.html',
  styleUrls: ['./planificacion-rutas.page.scss'],
  styles: [
    `
  
    #mapa {
      height:100%;
     width:100%;
  
    }

    `
  ]
})
export class PlanificacionRutasPage implements OnInit {


    constructor(public global: GlobalService,public modalCtrl: ModalController, public alertCtrl: AlertController, public config: ConfiguracionRutaService, public clientes: ClientesService, public zonas: ZonasService, public rutas: RutasService, public clienteEspejo: ClienteEspejoService, public map: MapService  , route:ActivatedRoute, public popOverCrtl: PopoverController, public mapa: MapaService) {


    }
  
    ngOnInit(){
 
  
    
    }
          
}
