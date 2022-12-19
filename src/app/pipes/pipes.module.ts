import { NgModule } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { FiltroPipe } from './filtro.pipe';
import { ColonesPipe } from './colones.pipe';


@NgModule({
  declarations: [
    FiltroPipe,
    ColonesPipe
    
  ],
  imports: [
    CommonModule
  ],
  exports:[
   
    FiltroPipe,
    DatePipe,
    DecimalPipe,
    ColonesPipe
  ]
})
export class PipesModule { }
