import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiltroClientesPipe } from './filtro-clientes.pipe';



@NgModule({
  declarations: [
    FiltroClientesPipe
  ],
  imports: [
    CommonModule
  ]
})
export class PipesModule { }
