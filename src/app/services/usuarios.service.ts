import { Injectable } from '@angular/core';
import { ConfiguracionesService } from './configuraciones.service';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  usuario= {
     EMPLEADO: 'Employee',
     Usuario: this.configuracioneService.company.user,
     Clave: 'admin123',
     Email: this.configuracioneService.company.email,
     Nombre: this.configuracioneService.company.company,
     UsuarioExactus: this.configuracioneService.company.user
    
  };
  constructor(
public configuracioneService: ConfiguracionesService


  ) { }
}
