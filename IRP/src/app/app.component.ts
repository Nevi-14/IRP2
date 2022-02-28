import { Component, OnInit } from '@angular/core';
import { ZonasService } from './services/zonas.service';
import { RutaZonaService } from './services/ruta-zona.service';
import * as  mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';
import { GlobalService } from './services/global.service';
import { BusquedaClienteService } from './services/busqueda-cliente.service';
import { ProvinciasService } from './services/provincias.service';
import { RutasService } from './services/rutas.service';
import { DataTableService } from './services/data-table.service';
import { RuteroService } from './services/rutero.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent implements OnInit {
  mapSvg = '../assets/home/map.svg';
  
  constructor( 
    private provincias: ProvinciasService,
   private rutas: RutasService,
   private zonas: ZonasService,
   private rutaZona : RutaZonaService,
   private global: GlobalService,
   public datable: DataTableService,
   public rutero: RuteroService
   
   ) {}
  ngOnInit(){
 

    this.rutero.syncRutero('20220215SJ03V02');
    this.global.mapMenu = false;
    (mapboxgl as any ).accessToken = environment.mapboxKey;
    console.log('appComponent')
    this.provincias.syncProvincias();
    this.rutas.syncRutas();
    this.zonas.syncZonas();
    this.rutaZona.syncRutas();

  
   }
}
