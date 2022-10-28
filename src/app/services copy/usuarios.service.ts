import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  usuario= {
     EMPLEADO: 'Isleña',
     Usuario: 'Islena',
     Clave: 'admin123',
     Email: 'email@email.com',
     Nombre: 'Distribuidora Isleña',
     UsuarioExactus: 'Isle'
    
  };
  constructor() { }
}
