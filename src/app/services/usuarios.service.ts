import { Injectable } from '@angular/core';
import { ConfiguracionesService } from './configuraciones.service';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  usuario = null
  constructor(
public configuracioneService: ConfiguracionesService


  ) { }
}
