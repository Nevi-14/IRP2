import { Component, OnInit } from '@angular/core';
import * as  mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent implements OnInit {
  mapSvg = '../assets/home/map.svg';
  
  constructor( 

   
   ) {}
  ngOnInit(){
 

    //this.global.mapMenu = false;
    (mapboxgl as any ).accessToken = environment.mapboxKey;
 
  
   }
}
