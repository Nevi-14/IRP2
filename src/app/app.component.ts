import { Component, OnInit } from '@angular/core';
import { ConfiguracionesService } from './services/configuraciones.service';
import * as  mapboxgl from 'mapbox-gl';
 
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent implements OnInit {
  mapSvg = '../assets/home/map.svg';
  
  constructor( 
    public configuracionesService: ConfiguracionesService,
   ) {}
  ngOnInit(){
    

    this.checkMapBoxKey();
   }

   checkMapBoxKey(){
    this.configuracionesService.cargarDatos();
 if(!this.configuracionesService.company){
  this.checkMapBoxKey();
   }else{
    (mapboxgl as any ).accessToken = this.configuracionesService.company.mapboxKey;
   }
 
   }
   
}
