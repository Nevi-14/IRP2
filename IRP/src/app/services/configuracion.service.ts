import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionService {
  fecha = new Date().toLocaleDateString();
  constructor() { }
}
