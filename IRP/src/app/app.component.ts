import { Component, OnInit } from '@angular/core';
import { ProvinciasService } from './services/paginas/organizacion territorial/provincias.service';
import { RutasService } from './services/paginas/rutas/rutas.service';
import { ZonasService } from './services/paginas/organizacion territorial/zonas.service';
import { RutaZonaService } from './services/paginas/rutas/ruta-zona.service';
import * as  mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';
import { GlobalService } from './services/global.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent implements OnInit {
  mapSvg = '../assets/home/map.svg';
  
  constructor( private provincias: ProvinciasService,  private rutas: RutasService, private zonas: ZonasService, private rutaZona : RutaZonaService, private global: GlobalService) {}
  ngOnInit(){
    this.global.mapMenu = false;
    (mapboxgl as any ).accessToken = environment.mapboxKey;
    console.log('appComponent')
    this.provincias.syncProvincias();
    this.rutas.syncRutas();
    this.zonas.syncZonas();
    this.rutaZona.syncRutas();
  
   }
}
