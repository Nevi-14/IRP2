import { Injectable } from '@angular/core';

interface MarcadorColor {
  color: string,
  nombre?: string,
  marker?: mapboxgl.Marker,
  centro?:[number,number]
}


@Injectable({
  providedIn: 'root'
})
export class MapaService {

  constructor() { }
}
