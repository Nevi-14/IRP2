import { Component, OnInit } from '@angular/core';
import * as  mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';;
import { ConfiguracionesService } from './services/configuraciones.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent implements OnInit {
  mapSvg = '../assets/home/map.svg';
  
  constructor( 
    public configuracionesService: ConfiguracionesService
   ) {}
  ngOnInit(){
 
this.checkMapBoxKey();
   }

   checkMapBoxKey(){

 if(!this.configuracionesService.company){
setTimeout(()=>{

  this.checkMapBoxKey();
}, 1000)
  return;
   }
   (mapboxgl as any ).accessToken = this.configuracionesService.company.mapboxKey;
   }
   
}
