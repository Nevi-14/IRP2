import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionRutaService {
  nombreRuta = '';
  totalClientesRuta = 0;
  ruta = '';
  zona = '';
  constructor() { }
}
