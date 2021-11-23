import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiltroClientesPipe } from './filtro-clientes.pipe';
import { FiltroPipe } from './filtro.pipe';

import { Rutas } from '../models/rutas';
import { RutasPipe } from './rutas.pipe';



@NgModule({
  declarations: [
    FiltroClientesPipe,
    FiltroPipe,
    RutasPipe
  ],
  imports: [
    CommonModule
  ],
  exports:[
    FiltroClientesPipe,
    FiltroPipe,
    RutasPipe
  ]
})
export class PipesModule { }
