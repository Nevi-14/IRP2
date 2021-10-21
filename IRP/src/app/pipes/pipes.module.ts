import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiltroClientesPipe } from './filtro-clientes.pipe';
import { FiltroPipe } from './filtro.pipe';



@NgModule({
  declarations: [
    FiltroClientesPipe,
    FiltroPipe
  ],
  imports: [
    CommonModule
  ]
})
export class PipesModule { }
