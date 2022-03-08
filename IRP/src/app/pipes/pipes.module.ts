import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiltroClientesPipe } from './filtro-clientes.pipe';
import { FiltroPipe } from './filtro.pipe';
import { RutasPipe } from './rutas.pipe';
import { BarraBusquedaPipe } from './barra-busqueda.pipe';



@NgModule({
  declarations: [
    FiltroClientesPipe,
    FiltroPipe,
    RutasPipe,
    BarraBusquedaPipe,
    
  ],
  imports: [
    CommonModule
  ],
  exports:[
    FiltroClientesPipe,
    FiltroPipe,
    RutasPipe,
    BarraBusquedaPipe
  ]
})
export class PipesModule { }
