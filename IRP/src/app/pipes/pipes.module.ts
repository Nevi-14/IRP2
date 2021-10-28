import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiltroClientesPipe } from './filtro-clientes.pipe';
import { FiltroPipe } from './filtro.pipe';
import { RutasPipe } from './rutas.pipe';



@NgModule({
  declarations: [
    FiltroClientesPipe,
    FiltroPipe,
    RutasPipe
  ],
  imports: [
    CommonModule
  ]
})
export class PipesModule { }
