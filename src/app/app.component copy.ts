import { Component, OnInit } from '@angular/core';
import * as  mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';;
import { ConfiguracionesService } from './services/configuraciones.service';
import LogRocket from 'logrocket';
 
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
    
    LogRocket.init('oifd5j/irp');
    this.checkMapBoxKey();
   }

   checkMapBoxKey(){
    this.configuracionesService.cargarDatos();
 if(!this.configuracionesService.company){
setTimeout(()=>{

  this.checkMapBoxKey();
}, 1000)
  return;
   }
   (mapboxgl as any ).accessToken = this.configuracionesService.company.mapboxKey;
   }
   
}
